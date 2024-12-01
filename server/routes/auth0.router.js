import { Router } from 'express'
// import mongoose from 'mongoose'
import { auth0ManagementClient } from '../helpers/auth0.helper.js'
import Editor from '../models/editor.models.js'
import Owner from '../models/owner.model.js'
const router = Router()

router.post('/create', async (req, res) => {
	try {
		const { email } = req.body
		const user = await auth0ManagementClient.usersByEmail
			.getByEmail({ email, include_fields: true })
			.then((res) => res.data[0])

		console.log('/auth0/create', user)

		if (user.user_metadata.role === 'Owner') {
			const findOwner = await Owner.findOne({ email: user.email })
			const providerSub = user.identities.map((identity) => `${identity.provider}|${identity.user_id}`)
			if (findOwner) {
				let message = 'Owner already exists'
				if (findOwner.providerSub !== providerSub) {
					await Owner.findOneAndUpdate({ email: user.email }, { providerSub: providerSub })
					message = 'Owner Updated'
				}
				console.log(message)

				return res.status(200).json({ message, user })
			}
			const owner = new Owner({
				username: user.nickname,
				email: user.email,
				profilephoto: user.picture,
				providerSub: providerSub,
			})
			await owner.save()
			console.log('Owner created successfully')
			return res.status(200).json({ message: 'Owner created successfully', user })
		} else if (user.user_metadata.role === 'Editor') {
			const findEditor = await Editor.findOne({ email: user.email })
			const providerSub = user.identities.map((identity) => `${identity.provider}|${identity.user_id}`)
			if (findEditor) {
				let message = 'Editor already exists'
				if (findEditor.providerSub !== providerSub) {
					await Editor.findOneAndUpdate({ email: user.email }, { providerSub: providerSub })
					message = 'Editor Updated'
				}
				console.log(message)

				return res.status(200).json({ message, user })
			}
			const editor = new Editor({
				name: user.nickname,
				email: user.email,
				profilephoto: user.picture,
				providerSub: providerSub,
			})
			await editor.save()
			console.log('Editor created successfully')
			return res.status(200).json({ message: 'Editor created successfully', user })
		} else {
			console.log('User role undefined')
		}
	} catch (error) {
		console.error('Error in /auth0/create:', error)
		return res.status(500).json({ message: 'Internal server error', error: error.message })
	}
})

export default router
