import express from 'express'
import {
	createOwner,
	deleteOwner,
	getAllOwners,
	getHiredEditors,
	getOwnerByEmail,
	getOwnerProfile,
	updateOwner,
	getOwnerNameById,
} from '../controllers/owner.controller.js'
import { createOwnerProfile, updateOwnerProfile, updateBasicProfile } from '../controllers/profileSetting.controller.js'
import { upload } from '../middlewares/multer.middleware.js'

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Owner:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the owner
 *         email:
 *           type: string
 *           description: Owner's email address
 *         username:
 *           type: string
 *           description: Owner's username
 *         profilephoto:
 *           type: string
 *           description: URL to owner's profile photo
 *         bio:
 *           type: string
 *           description: Owner's biography
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the owner account was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the owner account was last updated
 */

/**
 * @swagger
 * /api/ownerProfile:
 *   get:
 *     summary: Get all owners (admin access)
 *     tags: [Owners]
 *     responses:
 *       200:
 *         description: List of all owners
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Owner'
 *       500:
 *         description: Server error
 */
router.get('/ownerProfile', getAllOwners)

/**
 * @swagger
 * /api/ownerProfile/{email}:
 *   get:
 *     summary: Get owner by email
 *     tags: [Owners]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Owner's email address
 *     responses:
 *       200:
 *         description: Owner details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Owner'
 *       404:
 *         description: Owner not found
 *       500:
 *         description: Server error
 */
router.get('/ownerProfile/:email', getOwnerByEmail)

/**
 * @swagger
 * /api/ownerProfile:
 *   post:
 *     summary: Create a new owner
 *     tags: [Owners]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Owner's email address
 *               username:
 *                 type: string
 *                 description: Owner's username
 *             required:
 *               - email
 *               - username
 *     responses:
 *       201:
 *         description: Owner created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Owner'
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
router.post('/ownerProfile', createOwner)

/**
 * @swagger
 * /api/ownerProfile/{email}:
 *   patch:
 *     summary: Update owner information
 *     tags: [Owners]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Owner's email address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Updated username
 *               bio:
 *                 type: string
 *                 description: Updated biography
 *     responses:
 *       200:
 *         description: Owner updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Owner'
 *       404:
 *         description: Owner not found
 *       500:
 *         description: Server error
 */
router.patch('/ownerProfile/:email', updateOwner)

/**
 * @swagger
 * /api/ownerProfile/{email}:
 *   delete:
 *     summary: Delete an owner
 *     tags: [Owners]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Owner's email address
 *     responses:
 *       200:
 *         description: Owner deleted successfully
 *       404:
 *         description: Owner not found
 *       500:
 *         description: Server error
 */
router.delete('/ownerProfile/:email', deleteOwner)

/**
 * @swagger
 * /api/owner/profile/{id}:
 *   get:
 *     summary: Get owner profile by ID
 *     tags: [Owners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Owner ID
 *     responses:
 *       200:
 *         description: Owner profile details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Owner'
 *       404:
 *         description: Owner not found
 *       500:
 *         description: Server error
 */
router.get('/owner/profile/:id', getOwnerProfile)

/**
 * @swagger
 * /api/owner/profile/setup/{id}:
 *   post:
 *     summary: Create owner profile
 *     tags: [Owners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Owner ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Profile photo
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       201:
 *         description: Owner profile created successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
router.post('/owner/profile/setup/:id', upload.single('file'), createOwnerProfile)

/**
 * @swagger
 * /api/owner/profile/settings/{id}:
 *   put:
 *     summary: Update owner profile settings
 *     tags: [Owners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Owner ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Updated profile photo
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Owner profile updated successfully
 *       404:
 *         description: Owner not found
 *       500:
 *         description: Server error
 */
router.put('/owner/profile/settings/:id', upload.single('file'), updateOwnerProfile)

/**
 * @swagger
 * /api/owner/profile/basic/{id}:
 *   patch:
 *     summary: Update owner's basic profile
 *     tags: [Owners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Owner ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Updated profile photo
 *               username:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Basic profile updated successfully
 *       404:
 *         description: Owner not found
 *       500:
 *         description: Server error
 */
router.patch('/owner/profile/basic/:id', upload.single('file'), updateBasicProfile)

/**
 * @swagger
 * /api/hired-editors/{ownerId}:
 *   get:
 *     summary: Get editors hired by an owner
 *     tags: [Owners]
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Owner ID
 *     responses:
 *       200:
 *         description: List of hired editors
 *       404:
 *         description: Owner not found
 *       500:
 *         description: Server error
 */
router.get('/hired-editors/:ownerId', getHiredEditors)

/**
 * @swagger
 * /api/owner/name/{id}:
 *   get:
 *     summary: Get owner's name by ID
 *     tags: [Owners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Owner ID
 *     responses:
 *       200:
 *         description: Owner's name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *       404:
 *         description: Owner not found
 *       500:
 *         description: Server error
 */
router.get('/owner/name/:id', getOwnerNameById)

export default router
