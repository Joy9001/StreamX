import { Router } from 'express'
import { auth0CreateController } from '../controllers/auth0.controller.js'
const router = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Auth0User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the Auth0 user
 *         auth0Id:
 *           type: string
 *           description: ID from Auth0 authentication
 *         email:
 *           type: string
 *           description: User's email address
 *         role:
 *           type: string
 *           enum: [owner, editor, admin]
 *           description: User's role in the system
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the user was last updated
 */

/**
 * @swagger
 * /auth0/create:
 *   post:
 *     summary: Create a new Auth0 user in the system
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *               role:
 *                 type: string
 *                 enum: [owner, editor, admin]
 *                 description: User's role in the system
 *             required:
 *               - email
 *               - role
 *     responses:
 *       201:
 *         description: Auth0 user created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auth0User'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized - Invalid token
 *       500:
 *         description: Server error
 */
router.post('/create', auth0CreateController)

export default router
