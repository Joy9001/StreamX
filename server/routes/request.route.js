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

// Create a new request
router.post('/create', createRequest)

// Get requests by owner/editor ID
router.get('/to-id/:to_id', getRequestsByToId)

// Get requests by owner/editor ID
router.get('/from-id/:from_id', getRequestsByFromId)

// Update request status
router.patch('/:id/status', updateRequestStatus)

router.delete('/delete/:id', deleteRequest)

router.get('/aggregate/:fromId', aggregateRequestsController)

// Message thread routes
router.get('/:id/messages', getRequestMessages)
router.post('/:id/messages', addMessageToRequest)

router.post('/from-to', getRequestsByFromToId)
router.post('/change-price', changePrice)

export default router
