import express from 'express'
import {
	addMessageToRequest,
	aggregateRequestsController,
	changePrice,
	createRequest,
	deleteRequest,
	getRequestMessages,
	getRequestsByFromId,
	getRequestsByFromToId,
	getRequestsByToId,
	updateRequestStatus,
} from '../controllers/request.controller.js'

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Request:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the request
 *         from_id:
 *           type: string
 *           description: ID of the user who created the request
 *         to_id:
 *           type: string
 *           description: ID of the user who received the request
 *         status:
 *           type: string
 *           enum: [pending, accepted, rejected, completed]
 *           description: Current status of the request
 *         description:
 *           type: string
 *           description: Description of the request
 *         price:
 *           type: number
 *           description: Price or budget for the request
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the request was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the request was last updated
 *     RequestMessage:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the message
 *         requestId:
 *           type: string
 *           description: ID of the request this message belongs to
 *         senderId:
 *           type: string
 *           description: ID of the user who sent the message
 *         content:
 *           type: string
 *           description: Content of the message
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the message was created
 */

/**
 * @swagger
 * /requests/create:
 *   post:
 *     summary: Create a new request
 *     tags: [Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               from_id:
 *                 type: string
 *                 description: ID of the user creating the request
 *               to_id:
 *                 type: string
 *                 description: ID of the user receiving the request
 *               description:
 *                 type: string
 *                 description: Description of the request
 *               price:
 *                 type: number
 *                 description: Price or budget for the request
 *             required:
 *               - from_id
 *               - to_id
 *               - description
 *     responses:
 *       201:
 *         description: Request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
router.post('/create', createRequest)

/**
 * @swagger
 * /requests:
 *   get:
 *     summary: Get all requests
 *     tags: [Requests]
 *     responses:
 *       200:
 *         description: List of all requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Request'
 *       500:
 *         description: Server error
 */
router.get('/', getAllRequests)

/**
 * @swagger
 * /requests/all:
 *   get:
 *     summary: Get all updated requests
 *     tags: [Requests]
 *     responses:
 *       200:
 *         description: List of all updated requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Request'
 *       500:
 *         description: Server error
 */
router.get('/all', getAllUpdatedRequests)

/**
 * @swagger
 * /requests/to-id/{to_id}:
 *   get:
 *     summary: Get requests by recipient ID
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: to_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of request recipient
 *     responses:
 *       200:
 *         description: List of requests sent to the specified user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Request'
 *       500:
 *         description: Server error
 */
router.get('/to-id/:to_id', getRequestsByToId)

/**
 * @swagger
 * /requests/from-id/{from_id}:
 *   get:
 *     summary: Get requests by sender ID
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: from_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of request sender
 *     responses:
 *       200:
 *         description: List of requests sent by the specified user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Request'
 *       500:
 *         description: Server error
 */
router.get('/from-id/:from_id', getRequestsByFromId)

/**
 * @swagger
 * /requests/admin:
 *   get:
 *     summary: Get admin requests
 *     tags: [Requests]
 *     responses:
 *       200:
 *         description: List of admin requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Request'
 *       500:
 *         description: Server error
 */
router.get('/admin', getAdminRequests)

/**
 * @swagger
 * /requests/{id}/status:
 *   patch:
 *     summary: Update request status
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, accepted, rejected, completed]
 *                 description: New status for the request
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Request status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: Request not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/status', updateRequestStatus)

/**
 * @swagger
 * /requests/delete/{id}:
 *   delete:
 *     summary: Delete a request
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Request ID to delete
 *     responses:
 *       200:
 *         description: Request deleted successfully
 *       404:
 *         description: Request not found
 *       500:
 *         description: Server error
 */
router.delete('/delete/:id', deleteRequest)

/**
 * @swagger
 * /requests/aggregate/{fromId}:
 *   get:
 *     summary: Get aggregated request data for a user
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: fromId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to aggregate requests for
 *     responses:
 *       200:
 *         description: Aggregated request data
 *       500:
 *         description: Server error
 */
router.get('/aggregate/:fromId', aggregateRequestsController)

/**
 * @swagger
 * /requests/{id}/messages:
 *   get:
 *     summary: Get messages for a specific request
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Request ID
 *     responses:
 *       200:
 *         description: List of request messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RequestMessage'
 *       404:
 *         description: Request not found
 *       500:
 *         description: Server error
 */
router.get('/:id/messages', getRequestMessages)

/**
 * @swagger
 * /requests/{id}/messages:
 *   post:
 *     summary: Add a message to a request
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senderId:
 *                 type: string
 *                 description: ID of the user sending the message
 *               content:
 *                 type: string
 *                 description: Message content
 *             required:
 *               - senderId
 *               - content
 *     responses:
 *       201:
 *         description: Message added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RequestMessage'
 *       400:
 *         description: Invalid message data
 *       404:
 *         description: Request not found
 *       500:
 *         description: Server error
 */
router.post('/:id/messages', addMessageToRequest)

/**
 * @swagger
 * /requests/from-to:
 *   post:
 *     summary: Get requests between two users
 *     tags: [Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromId:
 *                 type: string
 *                 description: ID of the sender
 *               toId:
 *                 type: string
 *                 description: ID of the receiver
 *             required:
 *               - fromId
 *               - toId
 *     responses:
 *       200:
 *         description: List of requests between specified users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Request'
 *       500:
 *         description: Server error
 */
router.post('/from-to', getRequestsByFromToId)

/**
 * @swagger
 * /requests/change-price:
 *   post:
 *     summary: Change the price of a request
 *     tags: [Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestId:
 *                 type: string
 *                 description: ID of the request
 *               price:
 *                 type: number
 *                 description: New price
 *             required:
 *               - requestId
 *               - price
 *     responses:
 *       200:
 *         description: Request price updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       404:
 *         description: Request not found
 *       500:
 *         description: Server error
 */
router.post('/change-price', changePrice)

export default router
