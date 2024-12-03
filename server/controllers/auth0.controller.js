import { findUserByEmail } from '../helpers/auth0.helper.js'
import Admin from '../models/admin.model.js'
import Editor from '../models/editor.models.js'
import Owner from '../models/owner.model.js'

export const auth0CreateController = async (req, res) => {
	try {
		const { email, userId } = req.body
		const user = await findUserByEmail(email)

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

				return res.status(200).json({ message, user: { ...user, _id: findOwner._id } })
			}
			const owner = new Owner({
				username: user.nickname,
				email: user.email,
				profilephoto: user.picture,
				providerSub: providerSub,
			})
			await owner.save()
			console.log('Owner created successfully')
			return res.status(200).json({
				message: 'Owner created successfully',
				user: {
					...user,
					_id: owner._id,
				},
			})
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

				return res.status(200).json({
					message,
					user: {
						...user,
						_id: findEditor._id,
					},
				})
			}
			const editor = new Editor({
				name: user.nickname,
				email: user.email,
				profilephoto: user.picture,
				providerSub: providerSub,
			})
			await editor.save()
			console.log('Editor created successfully')
			return res.status(200).json({ message: 'Editor created successfully', user: { ...user, _id: editor._id } })
		} else if (user.user_metadata.role === 'Admin') {
			const findAdmin = await Admin.findOne({ email: user.email })
			const providerSub = user.identities.map((identity) => `${identity.provider}|${identity.user_id}`)
			if (findAdmin) {
				let message = 'Admin already exists'
				if (findAdmin.providerSub !== providerSub) {
					await Admin.findOneAndUpdate({ email: user.email }, { providerSub: providerSub })
					message = 'Admin Updated'
				}
				console.log(message)

				return res.status(200).json({
					message,
					user: {
						...user,
						_id: findAdmin._id,
					},
				})
			}
			const admin = new Admin({
				username: user.nickname,
				email: user.email,
				profilephoto: user.picture,
				providerSub: providerSub,
			})
			await admin.save()
			console.log('Admin created successfully')
			return res.status(200).json({ message: 'Admin created successfully', user: { ...user, _id: admin._id } })
		} else {
			console.log('User role undefined')
		}
	} catch (error) {
		console.error('Error in /auth0/create:', error)
		return res.status(500).json({ message: 'Internal server error', error: error.message })
	}
}
