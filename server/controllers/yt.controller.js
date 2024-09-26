import { getBytes, ref } from 'firebase/storage'
import { google } from 'googleapis'
import { StatusCodes } from 'http-status-codes'
import { Readable } from 'stream'
import { storage } from '../helpers/firebase.helper.js'
import { OAuth2Client } from '../helpers/yt.helper.js'
import Video from '../models/video.model.js'

const uploadController = async (req, res) => {
	try {
		// Your code here
		const { title, description, tags, categoryId, videoId } = req.body

		let findVideo = await Video.findOne({ _id: videoId })

		if (!findVideo) {
			return res.status(StatusCodes.NOT_FOUND).json({ error: 'Video not found' })
		}

		const youtube = google.youtube({
			version: 'v3',
			auth: OAuth2Client,
		})

		const videoRef = ref(storage, findVideo.metaData.fullPath)

		const videoBytes = await getBytes(videoRef)

		const videoStream = new Readable()
		videoStream.push(videoBytes)
		videoStream.push(null)

		console.log('videoStream', videoStream)

		const response = await youtube.videos.insert({
			part: 'snippet,status',
			requestBody: {
				snippet: {
					categoryId,
					description,
					title,
					tags,
				},
				status: {
					privacyStatus: 'private',
				},
			},
			media: {
				body: videoStream,
			},
		})

		console.log('yt response', response)

		findVideo.ytUploadStatus = 'Uploaded'
		findVideo.ytData = response.data

		let updatedVideo = await findVideo.save()

		res.status(StatusCodes.OK).json({ response, message: 'Video uploaded to YouTube', updatedVideo })
	} catch (error) {
		console.log('Error in yt uploadController:', error)
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
	}
}

export { uploadController }
