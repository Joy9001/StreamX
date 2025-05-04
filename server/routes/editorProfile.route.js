import express from 'express'
import {
	createEditorProfile,
	getEditorNameById,
	getHiredByOwners,
	deleteEditorByEmail,
	updateEditor,
	getEditorByEmail,
} from '../controllers/editorProfile.controller.js'
import { getAllEditors } from '../controllers/admin.controller.js'

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Editor:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the editor
 *         email:
 *           type: string
 *           description: Editor's email address
 *         name:
 *           type: string
 *           description: Editor's name
 *         profilephoto:
 *           type: string
 *           description: URL to editor's profile photo
 *         bio:
 *           type: string
 *           description: Editor's biography
 *         experience:
 *           type: number
 *           description: Years of experience
 *         area_of_expertise:
 *           type: array
 *           items:
 *             type: string
 *           description: List of areas of expertise
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the editor account was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the editor account was last updated
 */

/**
 * @swagger
 * /editorProfile:
 *   post:
 *     summary: Create a new editor profile
 *     tags: [Editors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Editor's email address
 *               name:
 *                 type: string
 *                 description: Editor's name
 *               bio:
 *                 type: string
 *                 description: Editor's biography
 *               profilephoto:
 *                 type: string
 *                 description: URL to editor's profile photo
 *               experience:
 *                 type: number
 *                 description: Years of experience
 *               area_of_expertise:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of areas of expertise
 *             required:
 *               - email
 *               - name
 *     responses:
 *       201:
 *         description: Editor profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Editor'
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
router.post('/', createEditorProfile)

/**
 * @swagger
 * /editorProfile:
 *   get:
 *     summary: Get all editor profiles
 *     tags: [Editors]
 *     responses:
 *       200:
 *         description: List of all editor profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Editor'
 *       500:
 *         description: Server error
 */
router.get('/', getAllEditors)

/**
 * @swagger
 * /editorProfile/name/{editorId}:
 *   get:
 *     summary: Get editor's name by ID
 *     tags: [Editors]
 *     parameters:
 *       - in: path
 *         name: editorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Editor ID
 *     responses:
 *       200:
 *         description: Editor's name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *       404:
 *         description: Editor not found
 *       500:
 *         description: Server error
 */
router.get('/name/:editorId', getEditorNameById)

/**
 * @swagger
 * /editorProfile/{email}:
 *   get:
 *     summary: Get editor by email
 *     tags: [Editors]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Editor's email address
 *     responses:
 *       200:
 *         description: Editor details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Editor'
 *       404:
 *         description: Editor not found
 *       500:
 *         description: Server error
 */
router.get('/:email', getEditorByEmail)

/**
 * @swagger
 * /editorProfile/{email}:
 *   put:
 *     summary: Update editor profile
 *     tags: [Editors]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Editor's email address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name
 *               bio:
 *                 type: string
 *                 description: Updated biography
 *               profilephoto:
 *                 type: string
 *                 description: Updated profile photo URL
 *               experience:
 *                 type: number
 *                 description: Updated years of experience
 *               area_of_expertise:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Updated areas of expertise
 *     responses:
 *       200:
 *         description: Editor profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Editor'
 *       404:
 *         description: Editor not found
 *       500:
 *         description: Server error
 */
router.put('/:email', updateEditor)

/**
 * @swagger
 * /editorProfile/{email}:
 *   delete:
 *     summary: Delete editor profile
 *     tags: [Editors]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Editor's email address
 *     responses:
 *       200:
 *         description: Editor profile deleted successfully
 *       404:
 *         description: Editor not found
 *       500:
 *         description: Server error
 */
router.delete('/:email', deleteEditorByEmail)

/**
 * @swagger
 * /editorProfile/hiredby/{editorId}:
 *   get:
 *     summary: Get owners who hired this editor
 *     tags: [Editors]
 *     parameters:
 *       - in: path
 *         name: editorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Editor ID
 *     responses:
 *       200:
 *         description: List of owners who hired this editor
 *       404:
 *         description: Editor not found
 *       500:
 *         description: Server error
 */
router.get('/hiredby/:editorId', getHiredByOwners)

export default router
