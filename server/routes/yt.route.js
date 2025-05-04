import { Router } from 'express'
import { reqAdminController, uploadController } from '../controllers/yt.controller.js'
const router = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     YTUpload:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the YouTube upload
 *         userId:
 *           type: string
 *           description: ID of the user who uploaded the video
 *         role:
 *           type: string
 *           enum: [Owner, Editor]
 *           description: Role of the user who uploaded
 *         videoId:
 *           type: string
 *           description: ID of the uploaded video
 *         youtubeLink:
 *           type: string
 *           description: Link to the YouTube video
 *         status:
 *           type: string
 *           description: Upload status
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the upload was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the upload was last updated
 */

/**
 * @swagger
 * /api/yt/upload/{role}/{userId}/{id}:
 *   post:
 *     summary: Upload a video to YouTube
 *     tags: [YouTube]
 *     parameters:
 *       - in: path
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Owner, Editor]
 *         description: Role of the user uploading
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user uploading
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the video to upload
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: YouTube video title
 *               description:
 *                 type: string
 *                 description: YouTube video description
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: YouTube video tags
 *               categoryId:
 *                 type: string
 *                 description: YouTube category ID
 *               privacyStatus:
 *                 type: string
 *                 enum: [private, public, unlisted]
 *                 description: Privacy status of the video
 *             required:
 *               - title
 *               - description
 *     responses:
 *       200:
 *         description: Video uploaded to YouTube successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/YTUpload'
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error during upload
 */
router.post('/upload/:role/:userId/:id', uploadController)

/**
 * @swagger
 * /api/yt/req-admin/{videoId}:
 *   post:
 *     summary: Request admin for YouTube upload
 *     tags: [YouTube]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the video for admin request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user making the request
 *               reason:
 *                 type: string
 *                 description: Reason for the admin request
 *             required:
 *               - userId
 *     responses:
 *       200:
 *         description: Admin request submitted successfully
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Video not found
 *       500:
 *         description: Server error
 */
router.post('/req-admin/:videoId', reqAdminController)

export default router
