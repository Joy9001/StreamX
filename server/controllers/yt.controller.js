import { getBytes, ref } from 'firebase/storage'
import { google } from 'googleapis'
import { StatusCodes } from 'http-status-codes'
import { Readable } from 'stream'
import { storage } from '../helpers/firebase.helper.js'
import { OAuth2Client, getChanelIds } from '../helpers/yt.helper.js'
import Admin from '../models/admin.model.js'
import Owner from '../models/owner.model.js'
import Request from '../models/Request.js'
import Video from '../models/video.model.js'

const uploadController = async (req, res) => {
	try {
		// Your code here
		const { role, userId, id } = req.params

		let videoData
		if (role === 'Owner') {
			videoData = req.body
		} else if (role === 'Admin') {
			const findVideo = await Video.findOne({ _id: id }).lean()
			if (!findVideo) {
				return res.status(StatusCodes.NOT_FOUND).json({ error: 'Video not found' })
			}
			videoData = {
				title: findVideo.ytData.title,
				description: findVideo.ytData.description,
				visibility: findVideo.ytData.visibility,
				audience: findVideo.ytData.audience,
				license: findVideo.ytData.license,
				allowEmbedding: findVideo.ytData.allowEmbedding,
				tags: findVideo.ytData.tags,
				recordingDate: findVideo.ytData.recordingDate,
				location: findVideo.ytData.location,
				selectedCategory: findVideo.ytData.selectedCategory,
			}

			const findOwner = await Owner.findOne({ _id: findVideo.ownerId }).lean()

			if (!findOwner) {
				return res.status(StatusCodes.NOT_FOUND).json({ error: 'Owner not found' })
			}

			videoData['gAccessToken'] = findOwner.gTokens.accessToken
			videoData['gRefreshToken'] = findOwner.gTokens.refreshToken
		} else {
			return res.status(StatusCodes.FORBIDDEN).json({ error: 'Invalid role' })
		}

		const {
			title,
			description,
			visibility,
			audience,
			license,
			allowEmbedding,
			tags,
			recordingDate,
			location,
			selectedCategory,
			gAccessToken,
			gRefreshToken,
		} = videoData

		console.log('videoData in yt uploadController', videoData)

		const user = await Owner.findOne({ _id: userId })
		if (!user) {
			return res.status(StatusCodes.NOT_FOUND).json({ error: 'Owner not found' })
		}

		let findVideo = await Video.findOne({ _id: id })

		if (!findVideo) {
			return res.status(StatusCodes.NOT_FOUND).json({ error: 'Video not found' })
		}

		if (findVideo.ytUploadStatus === 'Uploaded') {
			return res.status(StatusCodes.OK).json({ message: 'Video already uploaded to YouTube' })
		}

		const videoRef = ref(storage, findVideo.metaData.fullPath)

		const videoBytes = await getBytes(videoRef)

		const videoStream = new Readable()
		videoStream.push(Buffer.from(videoBytes))
		videoStream.push(null)

		// console.log('videoStream', videoStream)

		OAuth2Client.setCredentials({
			access_token: gAccessToken,
			refresh_token: gRefreshToken,
		})

		const youtube = google.youtube({
			version: 'v3',
			auth: OAuth2Client,
		})

		let channelId
		if (user.ytChannelId === '') {
			channelId = await getChanelIds(OAuth2Client, user._id)
		} else {
			channelId = user.ytChannelId
		}

		console.log('channelId in yt uploadController', channelId)

		const response = await youtube.videos.insert({
			part: 'snippet,status,recordingDetails',
			requestBody: {
				snippet: {
					channelId,
					title,
					description,
					tags,
					categoryId: selectedCategory,
					defaultLanguage: 'en',
					defaultAudioLanguage: 'en',
					defaultAudioLanguageCode: 'en-GB',
				},
				status: {
					privacyStatus: visibility,
					license: license,
					embeddable: allowEmbedding,
					madeForKids: audience === 'notMadeForKids' ? false : true,
					selfDeclaredMadeForKids: audience === 'notMadeForKids' ? false : true,
				},
				recordingDetails: {
					recordingDate,
				},
			},
			media: {
				body: videoStream,
			},
		})

		console.log('yt response', response)

		findVideo.ytUploadStatus = 'Uploaded'
		findVideo.ytData = response.data
		findVideo.ytFormData = {
			id,
			title,
			description,
			visibility,
			audience,
			license,
			allowEmbedding,
			tags,
			recordingDate,
			location,
			selectedCategory,
		}

		let updatedVideo = await findVideo.save()

		res.status(StatusCodes.OK).json({ response, message: 'Video uploaded to YouTube', updatedVideo })
	} catch (error) {
		console.log('Error in yt uploadController:', error)
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
	}
}

const reqAdminController = async (req, res) => {
	try {
		const { videoId } = req.params

		const {
			id,
			title,
			description,
			visibility,
			audience,
			license,
			allowEmbedding,
			tags,
			recordingDate,
			location,
			selectedCategory,
		} = req.body

		let findVideo = await Video.findOne({ _id: videoId })

		if (!findVideo) {
			return res.status(StatusCodes.NOT_FOUND).json({ message: 'Video not found' })
		}

		findVideo.ytData = {
			id,
			title,
			description,
			visibility,
			audience,
			license,
			allowEmbedding,
			tags,
			recordingDate,
			location,
			selectedCategory,
		}

		findVideo.approvalStatus = 'Pending'
		findVideo.ytUploadStatus = 'Pending'
		await findVideo.save()

		const findAdmin = await Admin.findOne({ role: 'admin' }).lean()

		if (!findAdmin) {
			return res.status(StatusCodes.NOT_FOUND).json({ message: 'Admin not found' })
		}

		// Create a request to the admin
		const newRequest = new Request({
			to_id: findAdmin._id,
			video_id: videoId,
			from_id: findVideo.ownerId,
			description: 'Please upload the video to youtube',
			price: 0,
			status: 'pending',
		})

		await newRequest.save()
		console.log('requst created', newRequest)

		res.status(StatusCodes.OK).json({ message: 'Request sent to admin' })
	} catch (error) {
		console.error('Error in reqAdminController:', error)
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Error saving form data',
			error: error.message,
		})
	}
}

// const uploadAdminController = async (req, res) => {

export { reqAdminController, uploadController }
