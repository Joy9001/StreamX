import passport from 'passport'
import '../strategy/jwt.strategy.js'

const isAuthenticated = (req, res, next) => {
	console.log('Inside isAuthenticated function')
	// console.log('req', req)
	console.log('req url', req.url)
	console.log('req user', req.user)
	console.log(req.isAuthenticated())
	if (req.isAuthenticated()) {
		console.log('Inside req.isAuthenticated checkpoint')
		return next()
	} else {
		// return res.status(401).json({ message: 'Unauthorized' })
		console.log('Inside else checkpoint')
	}

	passport.authenticate('jwt', async (err, user, info) => {
		if (err) {
			console.error('Error in isAuthenticated: ', err.message)
			return res.status(500).json({ error: 'Internal Server Error' })
		}

		console.log('sex user', user)
		if (user) {
			req.user = user
			return next()
		} else {
			console.log('No user found')
			return res.status(401).json({ message: 'Unauthorized' })
		}
	})(req, res, next)
}

export default isAuthenticated

// export const isAuthenticated = (req, res, next) => {
//     console.log('req url', req.url)
//     console.log('req user', req.user)

//     if (req.isAuthenticated()) {
//         console.log('Inside req.isAuthenticated checkpoint')
//         return next()
//     } else {
//         console.log('Inside else checkpoint')
//     }

//     passport.authenticate('jwt', async (err, user, info) => {
//         if (err) {
//             console.error('Error in isAuthenticated: ', err.message)
//             return res.status(500).json({ error: 'Internal Server Error' })
//         }

//         if (user) {
//             const userSession = {
//                 _id: user._id,
//             }
//             req.user = userSession
//             return next()
//         }
//         console.log('Info in isAuthenticated: ', info.message)
//         next()
//     })(req, res, next)
// }
