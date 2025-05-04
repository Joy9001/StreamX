import express from 'express'
import {
	createEditorGig,
	getEditorGigData,
	getEditorGigByEmail,
	updateEditorGigByEmail,
} from '../controllers/editorGig.controller.js'
import {
	updateEditorGigPlans,
	getEditorGigPlansByEmail,
	updateEditorGigPlansByEmail,
	getEditorGigPlans,
} from '../controllers/editorPlan.controller.js'

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     EditorGig:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the editor gig
 *         editorId:
 *           type: string
 *           description: ID of the editor
 *         title:
 *           type: string
 *           description: Title of the gig
 *         description:
 *           type: string
 *           description: Description of the gig
 *         price:
 *           type: number
 *           description: Price of the gig
 *         deliveryTime:
 *           type: number
 *           description: Delivery time in days
 *         revisions:
 *           type: number
 *           description: Number of revisions offered
 *     EditorGigPlan:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the plan
 *         editorId:
 *           type: string
 *           description: ID of the editor
 *         basicTitle:
 *           type: string
 *         basicDescription:
 *           type: string
 *         basicPrice:
 *           type: number
 *         standardTitle:
 *           type: string
 *         standardDescription:
 *           type: string
 *         standardPrice:
 *           type: number
 *         premiumTitle:
 *           type: string
 *         premiumDescription:
 *           type: string
 *         premiumPrice:
 *           type: number
 */

/**
 * @swagger
 * /editor_gig:
 *   post:
 *     summary: Create a new editor gig
 *     tags: [Editor Gigs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EditorGig'
 *     responses:
 *       201:
 *         description: Editor gig created successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
router.post('/', createEditorGig)

/**
 * @swagger
 * /editor_gig:
 *   get:
 *     summary: Get all editor gigs
 *     tags: [Editor Gigs]
 *     responses:
 *       200:
 *         description: List of all editor gigs
 *       500:
 *         description: Server error
 */
router.get('/', getEditorGigData)

/**
 * @swagger
 * /editor_gig/plans:
 *   get:
 *     summary: Get all editor gig plans
 *     tags: [Editor Gigs]
 *     responses:
 *       200:
 *         description: List of all editor gig plans
 *       500:
 *         description: Server error
 */
router.get('/plans', getEditorGigPlans)

/**
 * @swagger
 * /editor_gig/plan:
 *   post:
 *     summary: Create editor gig plans
 *     tags: [Editor Gigs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EditorGigPlan'
 *     responses:
 *       201:
 *         description: Editor gig plans created successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
router.post('/plan', updateEditorGigPlans)

/**
 * @swagger
 * /editor_gig/email/{email}:
 *   get:
 *     summary: Get editor gig by email
 *     tags: [Editor Gigs]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Editor gig details
 *       404:
 *         description: Editor gig not found
 *       500:
 *         description: Server error
 */
router.get('/email/:email', getEditorGigByEmail)

/**
 * @swagger
 * /editor_gig/plans/email/{email}:
 *   get:
 *     summary: Get editor gig plans by email
 *     tags: [Editor Gigs]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Editor gig plans
 *       404:
 *         description: Editor gig plans not found
 *       500:
 *         description: Server error
 */
router.get('/plans/email/:email', getEditorGigPlansByEmail)

/**
 * @swagger
 * /editor_gig/email/{email}:
 *   patch:
 *     summary: Update editor gig by email
 *     tags: [Editor Gigs]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EditorGig'
 *     responses:
 *       200:
 *         description: Editor gig updated successfully
 *       404:
 *         description: Editor gig not found
 *       500:
 *         description: Server error
 */
router.patch('/email/:email', updateEditorGigByEmail)

/**
 * @swagger
 * /editor_gig/plans/email/{email}:
 *   patch:
 *     summary: Update editor gig plans by email
 *     tags: [Editor Gigs]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EditorGigPlan'
 *     responses:
 *       200:
 *         description: Editor gig plans updated successfully
 *       404:
 *         description: Editor gig plans not found
 *       500:
 *         description: Server error
 */
router.patch('/plans/email/:email', updateEditorGigPlansByEmail)

export default router
