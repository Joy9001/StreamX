import { deleteObject, ref, uploadBytesResumable } from 'firebase/storage'
import { StatusCodes } from 'http-status-codes'
import { storage } from '../helpers/firebase.helper.js'
import Video from '../models/video.model.js'

const getAllController = async (_req, res) => {
	ownerid = '66efdc9aadf813b060a6c470'
	try {
		const videos = await Video.find({ ownerId: ownerid }).lean()
		return res.status(StatusCodes.OK).json({ videos })
	} catch (error) {
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: 'Failed to get videos', error: error.message })
	}
}

const uploadController = async (req, res) => {
	const { file } = req

	if (!file) {
		return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No file uploaded' })
	}

	try {
		const storageRef = ref(storage, `videos/${file.name ? file.name : `video-${Date.now()}`}`)
		const uploadTask = uploadBytesResumable(storageRef, file)

		//TODO: Add event listeners to uploadTask
		// Now, we will just wait for the upload to complete

		await uploadTask
		const downloadURL = await uploadTask.snapshot.ref.getDownloadURL()
		const vidMetaData = uploadTask.snapshot.metadata

		const newVideo = new Video({
			ownerId: '66efdc9aadf813b060a6c470',
			url: downloadURL,
			metaData: vidMetaData,
		})

		await newVideo.save()

		return res.status(StatusCodes.OK).json({ message: 'File uploaded successfully', url: downloadURL })
	} catch (error) {
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: 'Failed to upload file', error: error.message })
	}
}

const deleteController = async (req, res) => {
	const { id } = req.params

	try {
		const video = await Video.findByIdAndDelete(id)

		if (!video) {
			return res.status(StatusCodes.NOT_FOUND).json({ message: 'Video not found' })
		}

		const storageRef = ref(storage, `videos/${video.metaData.name}`)
		await deleteObject(storageRef)

		return res.status(StatusCodes.OK).json({ message: 'Video deleted successfully' })
	} catch (error) {
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
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: 'Failed to download video', error: error.message })
	}
}

export { deleteController, downloadController, getAllController, uploadController }

/*
  lastModified: 1723095840000
  lastModifiedDate: Thu Aug 08 2024 11:14:00 GMT+0530 (India Standard Time)
  name: "satoru-gojo-jujutsu-kaisen-4k-free-live-wallpaper.mp4"
  size: 10909653
  type: "video/mp4"
  */
