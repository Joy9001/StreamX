import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { StatusCodes } from 'http-status-codes'
import { storage } from '../helpers/firebase.helper.js'
import Video from '../models/video.model.js'

const getAllController = async (req, res) => {
	let ownerid = '66efdc9aadf813b060a6c470'
	try {
		const videos = await Video.find({ ownerId: ownerid }).lean()
		return res.status(StatusCodes.OK).json({ videos })
	} catch (error) {
		console.log('Error in getAllController', error)
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: 'Failed to get videos', error: error.message })
	}
}

const uploadController = async (req, res) => {
	console.log(req.file)
	const { file } = req

	if (!file) {
		return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No file uploaded' })
	}

	try {
		const filename = file.originalname || `video-${Date.now()}`

		const findVideo = await Video.findOne({ metaData: { name: filename } })
		if (findVideo) {
			filename = `${filename}-${Date.now()}`
		}

		const metadata = {
			encoding: file.encoding,
			contentType: file.mimetype,
			size: file.size,
		}
		const storageRef = ref(storage, `videos/${filename}`)
		const uploadTask = uploadBytesResumable(storageRef, file.buffer, metadata)

		//TODO: Add event listeners to uploadTask
		// Now, we will just wait for the upload to complete

		await uploadTask
		const downloadURL = await getDownloadURL(storageRef)
		const vidMetaData = uploadTask.snapshot.metadata

		const newVideo = new Video({
			ownerId: '66efdc9aadf813b060a6c470',
			url: downloadURL,
			metaData: vidMetaData,
		})

		let savedVideo = await newVideo.save()

		return res.status(StatusCodes.OK).json({ message: 'File uploaded successfully', url: downloadURL, savedVideo })
	} catch (error) {
		console.log('Error in uploadController', error)
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: 'Failed to upload file', error: error.message })
	}
}

const deleteController = async (req, res) => {
	const { id } = req.body
	console.log('id: ', req.body)
	try {
		const video = await Video.findById(id)

		if (!video) {
			return res.status(StatusCodes.NOT_FOUND).json({ message: 'Video not found' })
		}

		await video.deleteOne()

		const storageRef = ref(storage, `videos/${video.metaData.name}`)
		await deleteObject(storageRef)

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
		const video = await Video.findById(id).lean()

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
	try {
		const videos = await Video.find().sort({ createdAt: -1 }).limit(10)
		res.status(StatusCodes.OK).json({ videos })
	} catch (error) {
		console.log('Error in recentController', error)
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
	}
}
export { deleteController, downloadController, getAllController, recentController, uploadController }

/*
  lastModified: 1723095840000
  lastModifiedDate: Thu Aug 08 2024 11:14:00 GMT+0530 (India Standard Time)
  name: "satoru-gojo-jujutsu-kaisen-4k-free-live-wallpaper.mp4"
  size: 10909653
  type: "video/mp4"
  */
