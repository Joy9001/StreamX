import { Router } from 'express'
import {
	deleteController,
	getAllController,
	getAllVideos,
	recentController,
	storageUsageController,
	updateVideoOwnership,
	uploadController,
} from '../controllers/video.controller.js'
import { upload } from '../middlewares/multer.middleware.js'

const router = Router()

// Debug middleware
const logRequest = (req, res, next) => {
	console.log('Incoming request:', {
		method: req.method,
		path: req.path,
		params: req.params,
		body: req.body,
		headers: req.headers,
	})
	next()
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Video:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the video
 *         ownerId:
 *           type: string
 *           description: ID of the video owner
 *         editorId:
 *           type: string
 *           description: ID of the assigned editor
 *         url:
 *           type: string
 *           description: URL of the video
 *         editorAccess:
 *           type: boolean
 *           description: Whether editor has access to this video
 *         metaData:
 *           type: object
 *           description: Metadata of the video
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the video was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the video was last updated
 */

/**
 * @swagger
 * /api/videos/all-videos:
 *   get:
 *     summary: Get all videos (admin access)
 *     tags: [Videos]
 *     responses:
 *       200:
 *         description: List of all videos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 videos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Video'
 *       500:
 *         description: Server error
 */
router.get('/all-videos', getAllVideos)

/**
 * @swagger
 * /api/videos/all/{role}/{userId}:
 *   get:
 *     summary: Get all videos for a user based on role
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Owner, Editor, Admin]
 *         description: User role
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of videos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 videos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Video'
 *       400:
 *         description: Invalid role specified
 *       500:
 *         description: Server error
 */
router.get('/all/:role/:userId', getAllController)

/**
 * @swagger
 * /api/videos/recent/{role}/{userId}:
 *   get:
 *     summary: Get recent videos for a user based on role
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Owner, Editor, Admin]
 *         description: User role
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of recent videos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 videos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Video'
 *       400:
 *         description: Invalid role specified
 *       500:
 *         description: Server error
 */
router.get('/recent/:role/:userId', recentController)

/**
 * @swagger
 * /api/videos/storage-usages/{role}/{userId}:
 *   get:
 *     summary: Get storage usage for a user based on role
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Owner, Editor, Admin]
 *         description: User role
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Storage usage information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSize:
 *                   type: number
 *                   description: Total storage used in bytes
 *                 videoCount:
 *                   type: number
 *                   description: Number of videos
 *       400:
 *         description: Invalid role specified
 *       500:
 *         description: Server error
 */
router.get('/storage-usages/:role/:userId', storageUsageController)

/**
 * @swagger
 * /api/videos/upload:
 *   post:
 *     summary: Upload a new video
 *     tags: [Videos]
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
 *                 description: Video file to upload
 *               userId:
 *                 type: string
 *                 description: ID of the user uploading the video
 *               role:
 *                 type: string
 *                 enum: [Owner, Editor]
 *                 description: Role of the user uploading
 *     responses:
 *       200:
 *         description: Video uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Video'
 *       400:
 *         description: Invalid request or missing file
 *       500:
 *         description: Server error during upload
 */
router.post('/upload', upload.single('file'), uploadController)

/**
 * @swagger
 * /api/videos/update-ownership:
 *   patch:
 *     summary: Update video ownership
 *     tags: [Videos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               videoId:
 *                 type: string
 *                 description: ID of the video to update
 *               ownerId:
 *                 type: string
 *                 description: New owner ID
 *               editorId:
 *                 type: string
 *                 description: New editor ID
 *               editorAccess:
 *                 type: boolean
 *                 description: Whether editor has access
 *     responses:
 *       200:
 *         description: Video ownership updated successfully
 *       400:
 *         description: Invalid request or missing data
 *       500:
 *         description: Server error
 */
router.patch('/update-ownership', updateVideoOwnership)

/**
 * @swagger
 * /api/videos/delete:
 *   delete:
 *     summary: Delete a video
 *     tags: [Videos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               videoId:
 *                 type: string
 *                 description: ID of the video to delete
 *     responses:
 *       200:
 *         description: Video deleted successfully
 *       400:
 *         description: Invalid request or missing video ID
 *       404:
 *         description: Video not found
 *       500:
 *         description: Server error during deletion
 */
router.delete('/delete', deleteController)

//? Router-level middleware
router.use(logRequest)

export default router
