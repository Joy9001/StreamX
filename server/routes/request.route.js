import express from 'express'
import {
	aggregateRequestsController,
	createRequest,
	deleteRequest,
	getAdminRequests,
	getAllRequests,
	getAllUpdatedRequests,
	getRequestsByFromId,
	getRequestsByToId,
	updateRequestStatus,
	// New message controllers
	addMessageToRequest,
	getRequestMessages,
} from '../controllers/request.controller.js'

const router = express.Router()

// Create a new request
router.post('/create', createRequest)

// Get all requests
router.get('/', getAllRequests)

router.get('/all', getAllUpdatedRequests)

// Get requests by owner ID
router.get('/to-id/:to_id', getRequestsByToId)

// Get requests by editor ID
router.get('/from-id/:from_id', getRequestsByFromId)

// Get admin requests
router.get('/admin', getAdminRequests)

// Update request status
router.patch('/:id/status', updateRequestStatus)

router.delete('/delete/:id', deleteRequest)

router.get('/aggregate/:fromId', aggregateRequestsController)

// Message thread routes
router.get('/:id/messages', getRequestMessages)
router.post('/:id/messages', addMessageToRequest)

export default router
