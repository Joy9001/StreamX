import express from 'express'
import { createUser } from '../controllers/user.controller.js'
const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         email:
 *           type: string
 *           description: User's email address
 *         auth0Id:
 *           type: string
 *           description: User's Auth0 ID
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
 * /user:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
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
 *               auth0Id:
 *                 type: string
 *                 description: User's Auth0 ID
 *               role:
 *                 type: string
 *                 enum: [owner, editor, admin]
 *                 description: User's role in the system
 *             required:
 *               - email
 *               - auth0Id
 *               - role
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
router.post('/', createUser)

export default router
