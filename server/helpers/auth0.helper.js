import { ManagementClient } from 'auth0'
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

export const auth0ManagementClient = new ManagementClient({
	domain: process.env.AUTH0_DOMAIN,
	clientId: process.env.AUTH0_M2M_CLIENT_ID,
	clientSecret: process.env.AUTH0_M2M_CLIENT_SECRET,
})

export const findUserByEmail = async (email, userId) => {
	const user = await auth0ManagementClient.usersByEmail
		.getByEmail({ email, include_fields: true })
		.then((res) => res.data[0])
	console.log(user)
	if (!user) {
		throw new Error('User not found')
	}
	return user
}

export const getRefreshToken = async (id) => {
	let config = {
		method: 'get',
		maxBodyLength: Infinity,
		url: `https://login.auth0.com/api/v2/refresh-tokens/${id}`,
		headers: {
			Accept: 'application/json',
		},
	}

	let refreshToken
	axios
		.request(config)
		.then((response) => {
			console.log(JSON.stringify(response.data))
			refreshToken = response.data.refresh_token
		})
		.catch((error) => {
			console.log(error)
		})
	return refreshToken
}
