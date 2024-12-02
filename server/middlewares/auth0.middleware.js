import dotenv from 'dotenv'
import { expressjwt } from 'express-jwt'
import { claimCheck, InsufficientScopeError, requiredScopes } from 'express-oauth2-jwt-bearer'
import { expressJwtSecret } from 'jwks-rsa'
import VideoPermissions from '../helpers/permission.helper.js'

dotenv.config()

const authCheck = expressjwt({
	secret: expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
	}),
	aud: process.env.AUTH0_AUDIENCE,
	//issuer: `https://${process.env.AUTH0_DOMAIN}`,
	algorithms: ['RS256'],
})

// const authCheck = auth({
// 	audience: process.env.AUTH0_AUDIENCE,
// 	issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
// })

const checkRequiredPermissions = (requiredPermissions) => {
	return (req, res, next) => {
		const permissionCheck = claimCheck((payload) => {
			const permissions = payload.permissions || []

			const hasPermissions = requiredPermissions.every((requiredPermission) =>
				permissions.includes(requiredPermission)
			)

			if (!hasPermissions) {
				throw new InsufficientScopeError()
			}

			return hasPermissions
		})

		permissionCheck(req, res, next)
	}
}

const checkScopes = requiredScopes([
	VideoPermissions.Read,
	VideoPermissions.Create,
	VideoPermissions.Update,
	VideoPermissions.Delete,
])

export { authCheck, checkRequiredPermissions, checkScopes }
