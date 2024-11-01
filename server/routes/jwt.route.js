import { compareSync, hashSync } from 'bcrypt'
import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { Owner } from '../models/owner.model.js'

const router = Router()

router.post('/login', function (req, res) {
	console.log('server side login')
	Owner.findOne({ email: req.body.username }).then((user) => {
		// No user found
		if (!user) {
			return res.status(401).send({
				success: false,
				message: 'User not found',
			})
		}

		// Check if password is valid
		if (!compareSync(req.body.password, user.password)) {
			return res.status(401).send({
				success: false,
				message: 'Invalid password',
			})
		}

		// Create a token
		const payload = {
			id: user._id,
			username: user.username,
		}

		const token = jwt.sign(payload, 'Priyanshu', { expiresIn: '1d' })

		// User and password are valid
		return res.status(200).send({
			success: true,
			message: 'User authenticated successfully',
			token: token,
		})
	})
	console.log('server side login ended')
})
router.post('/register', function (req, res) {
	console.log('Register')
	console.log(req.body.name, req.body.email, req.body.password)
	const user = new Owner({
		username: req.body.name,
		email: req.body.email,
		password: hashSync(req.body.password, 10),
	})
	user.save()
		.then(function (user) {
			res.send({
				success: true,
				message: 'User registered successfully',
				user: user,
			})
		})
		.catch(function (err) {
			res.send({
				success: false,
				message: 'Failed to register user',
				error: err,
			})
		})
})
export default router
