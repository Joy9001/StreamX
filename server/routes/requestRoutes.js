import express from 'express'
import {
	createRequest,
	deleteRequest,
	getAllRequests,
	getRequestsByFromId,
	getRequestsByToId,
	updateRequestStatus,
} from '../controllers/requestController.js'

const router = express.Router()

// Create a new request
router.post('/create', createRequest)

// Get all requests
router.get('/', getAllRequests)

// Get requests by owner ID
router.get('/owner/:from_id', getRequestsByFromId)

// Get requests by editor ID
router.get('/editor/:to_id', getRequestsByToId)

// Update request status
router.patch('/:id/status', updateRequestStatus)

router.delete('/delete/:id', deleteRequest)

export default router
