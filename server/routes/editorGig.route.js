import express from 'express'
import { EditorData } from '../controllers/editorData.controller.js'
import { Editor_gig_cont, getEditorGigByEmail, updateEditorGigByEmail } from '../controllers/editorGig.controller.js'
import {
	Editor_gig_plans,
	getEditorGigPlansByEmail,
	updateEditorGigPlansByEmail,
} from '../controllers/editorPlan.controller.js'
import { EditorPlansData } from '../controllers/editorPlans.controller.js'

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
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the gig was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the gig was last updated
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
 *           description: Title for basic plan
 *         basicDescription:
 *           type: string
 *           description: Description for basic plan
 *         basicPrice:
 *           type: number
 *           description: Price for basic plan
 *         standardTitle:
 *           type: string
 *           description: Title for standard plan
 *         standardDescription:
 *           type: string
 *           description: Description for standard plan
 *         standardPrice:
 *           type: number
 *           description: Price for standard plan
 *         premiumTitle:
 *           type: string
 *           description: Title for premium plan
 *         premiumDescription:
 *           type: string
 *           description: Description for premium plan
 *         premiumPrice:
 *           type: number
 *           description: Price for premium plan
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the plans were created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the plans were last updated
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
 *             type: object
 *             properties:
 *               editorId:
 *                 type: string
 *                 description: ID of the editor
 *               title:
 *                 type: string
 *                 description: Title of the gig
 *               description:
 *                 type: string
 *                 description: Description of the gig
 *               price:
 *                 type: number
 *                 description: Price of the gig
 *               deliveryTime:
 *                 type: number
 *                 description: Delivery time in days
 *               revisions:
 *                 type: number
 *                 description: Number of revisions offered
 *             required:
 *               - editorId
 *               - title
 *               - description
 *               - price
 *     responses:
 *       201:
 *         description: Editor gig created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EditorGig'
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
router.post('/', Editor_gig_cont)

/**
 * @swagger
 * /editor_gig:
 *   get:
 *     summary: Get all editor gigs
 *     tags: [Editor Gigs]
 *     responses:
 *       200:
 *         description: List of all editor gigs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EditorGig'
 *       500:
 *         description: Server error
 */
router.get('/', EditorData)

/**
 * @swagger
 * /editor_gig/plans:
 *   get:
 *     summary: Get all editor gig plans
 *     tags: [Editor Gigs]
 *     responses:
 *       200:
 *         description: List of all editor gig plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EditorGigPlan'
 *       500:
 *         description: Server error
 */
router.get('/plans', EditorPlansData)

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
 *             type: object
 *             properties:
 *               editorId:
 *                 type: string
 *                 description: ID of the editor
 *               basicTitle:
 *                 type: string
 *                 description: Title for basic plan
 *               basicDescription:
 *                 type: string
 *                 description: Description for basic plan
 *               basicPrice:
 *                 type: number
 *                 description: Price for basic plan
 *               standardTitle:
 *                 type: string
 *                 description: Title for standard plan
 *               standardDescription:
 *                 type: string
 *                 description: Description for standard plan
 *               standardPrice:
 *                 type: number
 *                 description: Price for standard plan
 *               premiumTitle:
 *                 type: string
 *                 description: Title for premium plan
 *               premiumDescription:
 *                 type: string
 *                 description: Description for premium plan
 *               premiumPrice:
 *                 type: number
 *                 description: Price for premium plan
 *             required:
 *               - editorId
 *     responses:
 *       201:
 *         description: Editor gig plans created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EditorGigPlan'
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
router.post('/plan', Editor_gig_plans)

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
 *         description: Editor's email address
 *     responses:
 *       200:
 *         description: Editor gig details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EditorGig'
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
 *         description: Editor's email address
 *     responses:
 *       200:
 *         description: Editor gig plans
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EditorGigPlan'
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
 *         description: Editor's email address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Updated title
 *               description:
 *                 type: string
 *                 description: Updated description
 *               price:
 *                 type: number
 *                 description: Updated price
 *               deliveryTime:
 *                 type: number
 *                 description: Updated delivery time
 *               revisions:
 *                 type: number
 *                 description: Updated revisions
 *     responses:
 *       200:
 *         description: Editor gig updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EditorGig'
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
 *         description: Editor's email address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               basicTitle:
 *                 type: string
 *                 description: Updated title for basic plan
 *               basicDescription:
 *                 type: string
 *                 description: Updated description for basic plan
 *               basicPrice:
 *                 type: number
 *                 description: Updated price for basic plan
 *               standardTitle:
 *                 type: string
 *                 description: Updated title for standard plan
 *               standardDescription:
 *                 type: string
 *                 description: Updated description for standard plan
 *               standardPrice:
 *                 type: number
 *                 description: Updated price for standard plan
 *               premiumTitle:
 *                 type: string
 *                 description: Updated title for premium plan
 *               premiumDescription:
 *                 type: string
 *                 description: Updated description for premium plan
 *               premiumPrice:
 *                 type: number
 *                 description: Updated price for premium plan
 *     responses:
 *       200:
 *         description: Editor gig plans updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EditorGigPlan'
 *       404:
 *         description: Editor gig plans not found
 *       500:
 *         description: Server error
 */
router.patch('/plans/email/:email', updateEditorGigPlansByEmail)

export default router
