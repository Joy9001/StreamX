import dotenv from 'dotenv'
import passport from 'passport'
import { Strategy as JwtStrategy } from 'passport-jwt'
import { Owner } from '../models/owner.model.js'

dotenv.config()
const cookieExtractor = (req) => {
	let token = null
	// console.log('req', req)
	console.log('cookies: ', req.cookies)
	if (req && req.cookies) {
		token = req.cookies.token
	}
	return token
}

// Set up passport JWT strategy
export default passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: cookieExtractor,
			secretOrKey: process.env.TOKEN_SECRET, // Use env variable for the secret
			passReqToCallback: true, // Pass req to the callback
		},
		async (req, jwt_payload, done) => {
			console.log('jwt_payload:', jwt_payload)

			await Owner.findOne({ _id: jwt_payload.id })
				.then((user) => {
					if (user) {
						console.log('User found:', user)
						return done(null, user)
					} else {
						return done(null, false) // User not found
					}
				})
				.catch((err) => {
					return done(err, false) // Handle errors
				})
		}
	)
)
