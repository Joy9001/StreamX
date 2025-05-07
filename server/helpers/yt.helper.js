import { config } from 'dotenv'
import { google } from 'googleapis'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const base64Data = process.env.GOOGLE_CLIENT_SECRET_BASE64
const OAuth2Data = JSON.parse(Buffer.from(base64Data, 'base64').toString('utf8'))
console.log('OAuth2Data', OAuth2Data)

const CLIENT_ID = OAuth2Data.web.client_id
const CLIENT_SECRET = OAuth2Data.web.client_secret
const REDIRECT_URL = OAuth2Data.web.redirect_uris[0]
const AUTH_URI = OAuth2Data.web.auth_uri
const TOKEN_URI = OAuth2Data.web.token_uri
const OAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL, AUTH_URI, TOKEN_URI)

let scopes = ['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/userinfo.profile']

const getChanelIds = async (authClient, ownerId) => {
	try {
		const youtube = google.youtube({
			version: 'v3',
			auth: authClient,
		})

		const response = await youtube.channels.list({
			auth: authClient,
			part: 'snippet',
			forHandle: '@GoogleDevelopers',
		})

		console.log('res in getChanelIds', response.data)

		const channels = response.data.items

		if (channels && channels.length > 0) {
			const channelId = channels[0].id
			const channelName = channels[0].snippet.title

			const owner = await Owner.findOne({ _id: ownerId })
			if (!owner) {
				return null
			}
			owner.ytChannelId = channelId
			owner.ytChannelname = channelName
			await owner.save()
			console.log('owner in getChanelIds', owner)

			return channelId
		} else {
			return null
		}
	} catch (error) {
		console.log('Error in getChanelIds:', error)
		return null
	}
}

export { getChanelIds, OAuth2Client, scopes }
