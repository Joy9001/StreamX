import { Router } from 'express'
import passport from 'passport'
import '../strategy/google.strategy.js'
const router = Router()

router.get('/login/success', (req, res) => {
	if (req.user) {
		res.status(200).json({
			error: false,
			message: 'Successfully Loged In',
			user: req.user,
		})
	} else {
		res.status(403).json({ error: true, message: 'Not Authorized' })
	}
})

router.get('/login/failed', (req, res) => {
	res.status(401).json({
		error: true,
		message: 'Log in failure',
	})
})

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get(
	'/owner/google/callback',
	passport.authenticate('google-owner', {
		successRedirect: 'http://localhost:5173/storage?login=true',
		failureRedirect: 'http://localhost:5173/login',
	})
)

router.get(
	'/editor/google/callback',
	passport.authenticate('google-editor', {
		successRedirect: 'http://localhost:5173/editor',
		failureRedirect: 'http://localhost:5173/login',
	})
)

router.get('/logout', async (req, res, next) => {
	try {
		req.logout()
		req.session.destroy(function (err) {
			if (err) {
				return next(err)
			}
			req.session = null
			console.log('Session destroyed')

			res.clearCookie('connect.sid', { path: '/', httpOnly: true })
			console.log('Cookie cleared')
			return res.status(200).json({ error: false, message: 'Logged Out' })
		})
	} catch (error) {
		return res.status(500).json({ error: 'Internal Server Error' })
	}
})

export default router
