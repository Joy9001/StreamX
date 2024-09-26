import { google } from 'googleapis'
import OAuth2Data from '../.secrets/client_secret_528945799755-doq1f7itrq60a9k243lgi8ipdvm7j4e7.apps.googleusercontent.com.json' with { type: 'json' }

const CLIENT_ID = OAuth2Data.web.client_id
const CLIENT_SECRET = OAuth2Data.web.client_secret
const REDIRECT_URL = OAuth2Data.web.redirect_uris[0]
const AUTH_URI = OAuth2Data.web.auth_uri
const TOKEN_URI = OAuth2Data.web.token_uri
const OAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL, AUTH_URI, TOKEN_URI)

let scopes = ['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/userinfo.profile']

export { OAuth2Client, scopes }
