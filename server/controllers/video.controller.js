import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { StatusCodes } from 'http-status-codes'
import { storage } from '../helpers/firebase.helper.js'
import Editor from '../models/editor.models.js'
import Owner from '../models/owner.model.js'
import Video from '../models/video.model.js'

const getAllController = async (req, res) => {
	const { userId, role } = req.params
	try {
		const videos = await Video.find({ ownerId: userId }).lean()

		if (!videos) {
			return res.status(StatusCodes.NOT_FOUND).json({ message: 'No videos found' })
		}

		// find owner of videos
		let owner
		if (role === 'Owner') {
			owner = await Owner.findOne({ _id: userId }).lean()
		} else if (role === 'Editor') {
			owner = await Editor.findOne({ _id: userId }).lean()
		}

		if (!owner) {
			return res.status(StatusCodes.NOT_FOUND).json({ message: 'Owner not found' })
		}

		const videosData = videos.map((video) => {
			// console.log('video', { ...video })

			return {
				owner: owner.username,
				ownerPic: owner.profilephoto,
				...video,
			}
		})

		return res.status(StatusCodes.OK).json({ videos: videosData })
	} catch (error) {
		console.log('Error in getAllController', error)
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: 'Failed to get videos', error: error.message })
	}
}

const uploadController = async (req, res) => {
	console.log(req.file)
	console.log('body', req.body)
	const { file } = req
	const { userId, role } = req.params

	console.log('file in uploadController: ', file)
	console.log('userId in uploadController: ', userId)
	if (!file) {
		return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No file uploaded' })
	}

	try {
		const filename = file.originalname || `video-${Date.now()}`

		const findVideo = await Video.findOne({ metaData: { name: filename }, ownerId: userId })
		if (findVideo) {
			filename = `${filename}-${Date.now()}`
		}

		const metadata = {
			encoding: file.encoding,
			contentType: file.mimetype,
			size: file.size,
		}
		const storageRef = ref(storage, `videos/${userId}/${filename}`)
		const uploadTask = uploadBytesResumable(storageRef, file.buffer, metadata)

		//TODO: Add event listeners to uploadTask
		// Now, we will just wait for the upload to complete

		await uploadTask
		const downloadURL = await getDownloadURL(storageRef)
		const vidMetaData = uploadTask.snapshot.metadata

		const newVideo = new Video({
			ownerId: userId,
			url: downloadURL,
			metaData: vidMetaData,
		})

		const savedVideo = await newVideo.save()

		if (!savedVideo) {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to save video' })
		}

		console.log('savedVideo', { ...savedVideo._doc })

		// find owner of videos
		let owner
		if (role === 'Owner') {
			owner = await Owner.findOne({ _id: userId }).lean()
		} else if (role === 'Editor') {
			owner = await Editor.findOne({ _id: userId }).lean()
		}

		if (!owner) {
			return res.status(StatusCodes.NOT_FOUND).json({ message: 'Owner not found' })
		}

		const videoData = {
			owner: owner.username,
			ownerPic: owner.profilephoto,
			...savedVideo._doc,
		}

		return res.status(StatusCodes.OK).json({ message: 'File uploaded successfully', url: downloadURL, videoData })
	} catch (error) {
		console.log('Error in uploadController', error)
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: 'Failed to upload file', error: error.message })
	}
}

const deleteController = async (req, res) => {
	const { id, userId } = req.body
	console.log('/delete: ', req.body)
	try {
		const video = await Video.findOne({ _id: id, ownerId: userId }).lean()

		if (!video) {
			return res.status(StatusCodes.NOT_FOUND).json({ message: 'Video not found' })
		}

		const storageRef = ref(storage, `videos/${userId}/${video.metaData.name}`)
		await deleteObject(storageRef)

		await Video.findOneAndDelete({ _id: id })
		return res.status(StatusCodes.OK).json({ message: 'Video deleted successfully' })
	} catch (error) {
		console.log('Error in deleteController', error)
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: 'Failed to delete video', error: error.message })
	}
}

const downloadController = async (req, res) => {
	const { id } = req.params

	try {
		const video = await Video.findOne({ _id: id }).lean()

		if (!video) {
			return res.status(StatusCodes.NOT_FOUND).json({ message: 'Video not found' })
		}

		return res.status(StatusCodes.OK).download(video.url)
	} catch (error) {
		console.log('Error in downloadController', error)
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: 'Failed to download video', error: error.message })
	}
}

const recentController = async (req, res) => {
	const { userId, role } = req.params
	try {
		const videos = await Video.find({ ownerId: userId }).sort({ createdAt: -1 }).limit(10)

		if (!videos) {
			return res.status(StatusCodes.NOT_FOUND).json({ message: 'No videos found' })
		}

		// find owner of videos
		let owner
		if (role === 'Owner') {
			owner = await Owner.findOne({ _id: userId }).lean()
		} else if (role === 'Editor') {
			owner = await Editor.findOne({ _id: userId }).lean()
		}

		if (!owner) {
			return res.status(StatusCodes.NOT_FOUND).json({ message: 'Owner not found' })
		}

		const videosData = videos.map((video) => {
			// console.log('video', { ...video })
			return {
				owner: owner.username,
				ownerPic: owner.profilephoto,
				...video._doc,
			}
		})

		res.status(StatusCodes.OK).json({ videos: videosData })
	} catch (error) {
		console.log('Error in recentController', error)
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
	}
}

// Get video name by ID
const getVideoNameById = async (req, res) => {
	try {
		const { videoId } = req.params
		const video = await Video.findById(videoId).select('metaData')
		
		if (!video) {
			return res.status(StatusCodes.NOT_FOUND).json({ message: 'Video not found' })
		}

		const videoName = video.metaData.name || 'Untitled Video'
		return res.status(StatusCodes.OK).json({ name: videoName })
	} catch (error) {
		console.error('Error fetching video name:', error)
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: 'Failed to fetch video name', error: error.message })
	}
}

// Update video owner
const updateOwner = async (req, res) => {
    try {
        const { videoId } = req.params
        const { owner_id } = req.body

        console.log('Updating video owner:', {
            videoId,
            newOwnerId: owner_id,
            body: req.body
        })

        const updatedVideo = await Video.findByIdAndUpdate(
            videoId,
            { ownerId: owner_id },
            { new: true }
        )

        if (!updatedVideo) {
            console.log('Video not found:', videoId)
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Video not found' })
        }

        console.log('Video owner updated successfully:', updatedVideo)
        res.status(StatusCodes.OK).json(updatedVideo)
    } catch (error) {
        console.error('Error updating video owner:', error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            message: 'Error updating video owner', 
            error: error.message 
        })
    }
}

export { deleteController, downloadController, getAllController, getVideoNameById, recentController, uploadController, updateOwner }

/*
  lastModified: 1723095830000
  lastModifiedDate: Thu Aug 08 2024 11:14:00 GMT+0530 (India Standard Time)
  name: "satoru-gojo-jujutsu-kaisen-4k-free-live-wallpaper.mp4"
  size: 10909653
  type: "video/mp4"
  */
