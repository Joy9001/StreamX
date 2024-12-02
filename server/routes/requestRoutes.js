import express from 'express'
import {
	createRequest,
	getAllRequests,
	getRequestsByOwnerId,
	getRequestsByEditorId,
	updateRequestStatus,
} from '../controllers/requestController.js'

const router = express.Router()

// Create a new request
router.post('/create', createRequest)

// Get all requests
router.get('/', getAllRequests)

// Get requests by owner ID
router.get('/owner/:owner_id', getRequestsByOwnerId)

// Get requests by editor ID
router.get('/editor/:editor_id', getRequestsByEditorId)

// Update request status
router.patch('/:id/status', updateRequestStatus)

export default router
