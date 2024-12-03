import { getBytes, ref } from 'firebase/storage'
import { google } from 'googleapis'
import { StatusCodes } from 'http-status-codes'
import { Readable } from 'stream'
import { storage } from '../helpers/firebase.helper.js'
import { OAuth2Client, getChanelIds } from '../helpers/yt.helper.js'
import Admin from '../models/admin.model.js'
import Owner from '../models/owner.model.js'
import Video from '../models/video.model.js'

const uploadController = async (req, res) => {
	try {
		// Your code here
		const { role, userId } = req.params
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
			gAccessToken,
			gRefreshToken,
		} = req.body

		console.log('req.body in yt uploadController', req.body)

		let user
		if (role === 'Owner') {
			const owner = await Owner.findOne({ _id: userId })
			if (!owner) {
				return res.status(StatusCodes.NOT_FOUND).json({ error: 'Owner not found' })
			}
			user = owner
		} else if (role === 'Admin') {
			const admin = await Admin.findOne({ _id: userId })
			if (!admin) {
				return res.status(StatusCodes.NOT_FOUND).json({ error: 'Admin not found' })
			}
			user = admin
		} else {
			return res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' })
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
			channelId = await getChanelIds(OAuth2Client)
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

		let updatedVideo = await findVideo.save()

		res.status(StatusCodes.OK).json({ response, message: 'Video uploaded to YouTube', updatedVideo })
	} catch (error) {
		console.log('Error in yt uploadController:', error)
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
	}
}

export { getChanelIds, uploadController }
