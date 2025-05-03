import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { StatusCodes } from 'http-status-codes'
import { storage } from '../helpers/firebase.helper.js'
import cacheService from '../services/cache.service.js'
import Editor from '../models/editor.models.js'
import Owner from '../models/owner.model.js'
import Video from '../models/video.model.js'

const invalidateVideoCaches = async (video) => {
	await cacheService.invalidateVideoRelatedCaches(video)
}

const getAllController = async (req, res) => {
	const { userId, role } = req.params
	const cacheKey = cacheService.generateKey('allVideos', { role, userId })

	try {
		// Check cache first
		const cachedVideos = await cacheService.get(cacheKey)
		if (cachedVideos) {
			return res.status(StatusCodes.OK).json({ videos: cachedVideos })
		}

		// Fetch from DB if not in cache
		let videos
		if (role === 'Owner') {
			videos = await Video.find({ ownerId: userId }).lean()
		} else if (role === 'Editor') {
			videos = await Video.find({ editorId: userId }).lean()
		} else if (role === 'Admin') {
			// Use the dedicated getAllVideos function for Admin to simplify logic here?
			// Or keep it separate if params differ. For now, keep as is.
			videos = await Video.find().lean()
		} else {
			return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid role specified' })
		}

		if (!videos || videos.length === 0) {
			await cacheService.set(cacheKey, [], cacheService.TTL.LIST)
			return res.status(StatusCodes.OK).json({ videos: [] })
		}

		const editorIds = videos.map((video) => video.editorId).filter(Boolean)
		const ownerIds = videos.map((video) => video.ownerId).filter(Boolean)

		const [editors, owners] = await Promise.all([
			Editor.find({ _id: { $in: editorIds } }).lean(),
			Owner.find({ _id: { $in: ownerIds } }).lean(),
		])

		const videosData = videos.map((video) => {
			const editor = editors.find((e) => e._id.equals(video.editorId))
			const owner = owners.find((o) => o._id.equals(video.ownerId))
			return {
				owner: owner ? owner.username : '',
				ownerPic: owner ? owner.profilephoto : '',
				editor: editor ? editor.name : '',
				editorPic: editor ? editor.profilephoto : '',
				...video,
			}
		})

		// Store in cache
		await cacheService.set(cacheKey, videosData, cacheService.TTL.LIST)

		return res.status(StatusCodes.OK).json({ videos: videosData })
	} catch (error) {
		console.error('Error in getAllController', error)
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: 'Failed to get videos', error: error.message })
	}
}

const uploadController = async (req, res) => {
	const { file } = req
	const { userId, role } = req.body

	console.log('file in uploadController: ', file)
	console.log('userId in uploadController: ', userId)
	if (!file) {
		return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No file uploaded' })
	}

	try {
		const filename = `${file.originalname || 'video'}-${Date.now()}`

		const metadata = {
			encoding: file.encoding,
			contentType: file.mimetype,
			size: file.size,
		}

		const safeFilename = encodeURIComponent(filename)
		const storageRef = ref(storage, `videos/${userId}/${safeFilename}`)
		const uploadTask = uploadBytesResumable(storageRef, file.buffer, metadata)

		await uploadTask
		const downloadURL = await getDownloadURL(storageRef)
		const vidMetaData = uploadTask.snapshot.metadata
		vidMetaData.name = filename

		let newVideo
		if (role === 'Owner') {
			newVideo = new Video({
				ownerId: userId,
				url: downloadURL,
				metaData: vidMetaData,
			})
		} else if (role === 'Editor') {
			newVideo = new Video({
				editorId: userId,
				editorAccess: true,
				url: downloadURL,
				metaData: vidMetaData,
			})
		} else {
			return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid role for upload' })
		}

		const savedVideo = await newVideo.save()

		if (!savedVideo) {
			// Clean up uploaded file if DB save fails? (More robust error handling)
			try {
				await deleteObject(storageRef)
				console.log(`Firebase object deleted due to DB save failure: ${storageRef.fullPath}`)
			} catch (deleteError) {
				console.error(
					`Failed to delete Firebase object after DB save failure: ${storageRef.fullPath}`,
					deleteError
				)
			}
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to save video metadata' })
		}

		console.log('savedVideo', { ...savedVideo._doc })

		await invalidateVideoCaches(savedVideo)

		let user
		if (role === 'Owner') {
			user = await Owner.findById(userId).lean()
		} else if (role === 'Editor') {
			user = await Editor.findById(userId).lean()
		}

		if (!user) {
			console.error(`User not found after video upload: role=${role}, userId=${userId}`)
		}

		let videoData = { ...savedVideo._doc }
		if (role === 'Owner' && user) {
			videoData = {
				...videoData,
				owner: user.username,
				ownerPic: user.profilephoto,
				editor: '', // Editor might be assigned later
				editorPic: '',
			}
		} else if (role === 'Editor' && user) {
			// Need owner info if available
			let owner = null
			if (savedVideo.ownerId) {
				owner = await Owner.findById(savedVideo.ownerId).lean()
			}
			videoData = {
				...videoData,
				owner: owner ? owner.username : '',
				ownerPic: owner ? owner.profilephoto : '',
				editor: user.name,
				editorPic: user.profilephoto,
			}
		}

		return res.status(StatusCodes.OK).json({ message: 'File uploaded successfully', url: downloadURL, videoData })
	} catch (error) {
		console.error('Error in uploadController', error)
		// Attempt to clean up Firebase storage if an error occurred mid-process
		if (error.storageRef) {
			try {
				await deleteObject(error.storageRef)
				console.log(`Firebase object deleted due to error: ${error.storageRef.fullPath}`)
			} catch (deleteError) {
				console.error(`Failed to delete Firebase object after error: ${error.storageRef.fullPath}`, deleteError)
			}
		}
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: 'Failed to upload file', error: error.message })
	}
}

const deleteController = async (req, res) => {
	const { id, userId, role } = req.body
	console.log('/delete: ', req.body)

	if (!id || !userId || !role) {
		return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Missing required parameters (id, userId, role)' })
	}

	let video = null

	try {
		if (role === 'Owner') {
			video = await Video.findOne({ _id: id, ownerId: userId }).lean()
		} else if (role === 'Editor') {
			video = await Video.findOne({ _id: id, editorId: userId }).lean()
		} else if (role === 'Admin') {
			// Admins can delete any video, but we still need the video details
			video = await Video.findById(id).lean()
		} else {
			return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid role' })
		}

		if (!video) {
			return res.status(StatusCodes.NOT_FOUND).json({ message: 'Video not found or user lacks permission' })
		}

		const storagePath =
			video.storagePath || `videos/${video.ownerId || video.editorId}/${encodeURIComponent(video.metaData.name)}`
		const storageRef = ref(storage, storagePath)

		try {
			await deleteObject(storageRef)
			console.log(`Firebase object deleted: ${storagePath}`)
		} catch (storageError) {
			if (storageError.code !== 'storage/object-not-found') {
				console.error(
					`Error deleting from Firebase Storage (but continuing to DB delete): ${storagePath}`,
					storageError
				)
			} else {
				console.warn(
					`Firebase object not found during delete (expected if already deleted or path mismatch): ${storagePath}`
				)
			}
		}

		const deleteResult = await Video.deleteOne({ _id: id })

		if (deleteResult.deletedCount === 0) {
			console.warn(`Video not found in DB for deletion (ID: ${id}), possibly already deleted.`)
			await invalidateVideoCaches(video)
			return res
				.status(StatusCodes.OK)
				.json({ message: 'Video deletion processed (DB entry may have been already removed)' })
		}

		console.log(`Video deleted from DB: ${id}`)

		await invalidateVideoCaches(video)

		return res.status(StatusCodes.OK).json({ message: 'Video deleted successfully' })
	} catch (error) {
		console.error('Error in deleteController main block:', error)
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: 'Failed to delete video', error: error.message })
	}
}

const recentController = async (req, res) => {
	const { userId, role } = req.params
	const cacheKey = cacheService.generateKey('recentVideos', { role, userId })

	try {
		const cachedVideos = await cacheService.get(cacheKey)
		if (cachedVideos) {
			return res.status(StatusCodes.OK).json({ videos: cachedVideos })
		}

		let videos
		const query = role === 'Owner' ? { ownerId: userId } : role === 'Editor' ? { editorId: userId } : {}
		if (role !== 'Owner' && role !== 'Editor' && role !== 'Admin') {
			return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid role specified' })
		}

		if (role === 'Admin') {
			videos = await Video.find({}).sort({ createdAt: -1 }).limit(10).lean()
		} else {
			videos = await Video.find(query).sort({ createdAt: -1 }).limit(10).lean()
		}

		if (!videos || videos.length === 0) {
			await cacheService.set(cacheKey, [], cacheService.TTL.RECENT)
			return res.status(StatusCodes.OK).json({ videos: [] })
		}

		const ownerIds = [...new Set(videos.map((v) => v.ownerId?.toString()).filter(Boolean))]
		const editorIds = [...new Set(videos.map((v) => v.editorId?.toString()).filter(Boolean))]

		const [owners, editors] = await Promise.all([
			Owner.find({ _id: { $in: ownerIds } }).lean(),
			Editor.find({ _id: { $in: editorIds } }).lean(),
		])

		const ownerMap = new Map(owners.map((o) => [o._id.toString(), o]))
		const editorMap = new Map(editors.map((e) => [e._id.toString(), e]))

		const videosData = videos.map((video) => {
			const owner = ownerMap.get(video.ownerId?.toString())
			const editor = editorMap.get(video.editorId?.toString())
			return {
				...video,
				owner: owner ? owner.username : '',
				ownerPic: owner ? owner.profilephoto : '',
				editor: editor ? editor.name : '',
				editorPic: editor ? editor.profilephoto : '',
			}
		})

		await cacheService.set(cacheKey, videosData, cacheService.TTL.RECENT)

		res.status(StatusCodes.OK).json({ videos: videosData })
	} catch (error) {
		console.error('Error in recentController', error)
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Failed to get recent videos',
			error: error.message,
		})
	}
}

const updateVideoOwnership = async (req, res) => {
	const { videoId, userId, role } = req.body

	if (!userId) {
		return res.status(StatusCodes.BAD_REQUEST).json({ message: 'New user ID (userId) is required' })
	}

	if (role !== 'Owner' && role !== 'Editor') {
		return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid role specified (must be Owner or Editor)' })
	}

	try {
		const videoBeforeUpdate = await Video.findById(videoId).lean()
		if (!videoBeforeUpdate) {
			return res.status(StatusCodes.NOT_FOUND).json({ message: 'Video not found' })
		}

		let updateData = {}
		if (role === 'Owner') {
			updateData = { ownerId: userId }
		} else if (role === 'Editor') {
			updateData = {
				editorId: userId || null,
				editorAccess: true,
			}
		}

		const updatedVideo = await Video.findByIdAndUpdate(
			videoId,
			{ $set: updateData },
			{ new: true, runValidators: true }
		).lean()

		if (!updatedVideo) {
			console.log('Video not found during update:', videoId)
			return res.status(StatusCodes.NOT_FOUND).json({ message: 'Video not found during update' })
		}

		console.log(`Video ${role.toLowerCase()} updated successfully:`, updatedVideo)

		await invalidateVideoCaches(videoBeforeUpdate)
		await invalidateVideoCaches(updatedVideo)

		res.status(StatusCodes.OK).json(updatedVideo)
	} catch (error) {
		console.error(`Error updating video ${role.toLowerCase()}:`, error)
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: `Error updating video ${role.toLowerCase()}`,
			error: error.message,
			stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
		})
	}
}

const storageUsageController = async (req, res) => {
	const { role, userId } = req.params
	const cacheKey = cacheService.generateKey('storageUsage', { role, userId })

	try {
		// Check cache first
		const cachedUsage = await cacheService.get(cacheKey)
		if (cachedUsage !== null) {
			// Check for null, as 0 is a valid usage
			return res.status(StatusCodes.OK).json({ storageUsage: cachedUsage })
		}

		let videos
		const query = role === 'Owner' ? { ownerId: userId } : role === 'Editor' ? { editorId: userId } : {}
		if (role !== 'Owner' && role !== 'Editor' && role !== 'Admin') {
			return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid role specified' })
		}
		// Admin storage usage? Might be too heavy. Calculate only for Owner/Editor for now.
		if (role === 'Admin') {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: 'Storage usage calculation not supported for Admin role' })
		}

		videos = await Video.find(query).select('metaData.size').lean() // Select only size

		// No need to return 404 if no videos, usage is just 0
		// if (!videos) { ... }

		const storageUsage = videos.reduce((totalSize, video) => {
			const fileSize = video.metaData?.size || 0
			return totalSize + fileSize
		}, 0)

		// Store in cache
		await cacheService.set(cacheKey, storageUsage, cacheService.TTL.DEFAULT)

		console.log('storageUsage in storageUsageController: ', storageUsage)
		return res.status(StatusCodes.OK).json({ storageUsage })
	} catch (error) {
		console.error('Error in storageUsageController: ', error)
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: 'Failed to get storage usage', error: error.message })
	}
}

const getAllVideos = async (req, res) => {
	const cacheKey = cacheService.generateKey('allVideosAdmin', {})

	try {
		const cachedVideos = await cacheService.get(cacheKey)
		if (cachedVideos) {
			return res.status(StatusCodes.OK).json(cachedVideos)
		}

		// Get all videos and populate owner and editor details
		const videos = await Video.find()
			.populate('ownerId', 'username email profilephoto')
			.populate('editorId', 'name email profilephoto')
			.sort({ createdAt: -1 })
			.lean()

		const formattedVideos = videos.map((video) => ({
			...video,
			owner: video.ownerId
				? {
						id: video.ownerId._id,
						name: video.ownerId.username,
						email: video.ownerId.email,
						profilephoto: video.ownerId.profilephoto,
					}
				: { name: 'N/A' },
			editor: video.editorId
				? {
						id: video.editorId._id,
						name: video.editorId.name,
						email: video.editorId.email,
						profilephoto: video.editorId.profilephoto,
					}
				: { name: 'N/A' },

			metadata: {
				fileName: video.metaData?.name || 'Untitled',
				fileSize: video.metaData?.size ? `${(video.metaData.size / (1024 * 1024)).toFixed(2)} MB` : '0 MB',
				contentType: video.metaData?.contentType || 'video/mp4',
			},
		}))

		// Store in cache
		await cacheService.set(cacheKey, formattedVideos, cacheService.TTL.LIST) // Use list TTL

		res.status(StatusCodes.OK).json(formattedVideos)
	} catch (error) {
		console.error('Error fetching all videos (admin):', error)
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching videos', error: error.message }) // Use 500
	}
}

export {
	deleteController,
	getAllController,
	getAllVideos,
	recentController,
	storageUsageController,
	updateVideoOwnership,
	uploadController,
}
