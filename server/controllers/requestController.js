import Editor from '../models/editor.models.js'
import Editor_Gig from '../models/Editor_gig.js'
import Owner from '../models/owner.model.js'
import Request from '../models/Request.js'

// Create a new request
export const createRequest = async (req, res) => {
	try {
		const { to_id, video_id, from_id, description, price, status } = req.body

		// Create new request
		const newRequest = new Request({
			to_id,
			video_id,
			from_id,
			description,
			price,
			status: status || 'pending', // Default to pending if not provided
		})

		// Save the request
		const savedRequest = await newRequest.save()
		console.log('Saved request:', savedRequest)
		res.status(201).json(savedRequest)
	} catch (error) {
		console.error('Error creating request:', error)
		res.status(500).json({ message: 'Error creating request', error: error.message })
	}
}

// Get all requests
export const getAllRequests = async (req, res) => {
	try {
		const requests = await Request.find()
		res.status(200).json(requests)
	} catch (error) {
		console.error('Error fetching requests:', error)
		res.status(500).json({ message: 'Error fetching requests', error: error.message })
	}
}

// Get requests by owner ID
export const getRequestsByToId = async (req, res) => {
	try {
		const { to_id } = req.params
		const requests = await Request.find({ to_id })
		res.status(200).json(requests)
	} catch (error) {
		console.error('Error fetching owner requests:', error)
		res.status(500).json({ message: 'Error fetching owner requests', error: error.message })
	}
}

// Get requests by editor ID
export const getRequestsByFromId = async (req, res) => {
	try {
		const { from_id } = req.params
		const requests = await Request.find({ from_id })
		res.status(200).json(requests)
	} catch (error) {
		console.error('Error fetching editor requests:', error)
		res.status(500).json({ message: 'Error fetching editor requests', error: error.message })
	}
}

// Update request status
export const updateRequestStatus = async (req, res) => {
	try {
		const { id } = req.params
		const { status } = req.body

		const updatedRequest = await Request.findByIdAndUpdate(
			id,
			{ status },
			{ new: true } // Return the updated document
		)

		if (!updatedRequest) {
			return res.status(404).json({ message: 'Request not found' })
		}

		res.status(200).json(updatedRequest)
	} catch (error) {
		console.error('Error updating request:', error)
		res.status(500).json({ message: 'Error updating request', error: error.message })
	}
}

// Approve request
export const approveRequest = async (req, res) => {
	try {
		const { id } = req.params

		const updatedRequest = await Request.findByIdAndUpdate(id, { status: 'approved' }, { new: true })

		if (!updatedRequest) {
			return res.status(404).json({ message: 'Request not found' })
		}

		res.status(200).json(updatedRequest)
	} catch (error) {
		console.error('Error approving request:', error)
		res.status(500).json({ message: 'Error approving request', error: error.message })
	}
}

export const deleteRequest = async (req, res) => {
	try {
		const { id } = req.params

		const deletedRequest = await Request.findByIdAndDelete(id)

		if (!deletedRequest) {
			return res.status(404).json({ message: 'Request not found' })
		}

		res.status(200).json({ message: 'Request deleted successfully', deletedRequest })
	} catch (error) {
		console.error('Error deleting request:', error)
		res.status(500).json({ message: 'Error deleting request', error: error.message })
	}
}

export const getAllUpdatedRequests = async (req, res) => {
	try {
		// Fetch all requests with populated video data
		const requests = await Request.find().populate({
			path: 'video_id',
			select: 'url metaData',
		})

		const processedRequests = []

		// Process each request
		for (const request of requests) {
			// Find owner (from_id)
			let from
			let fromUser
			fromUser = await Owner.findById(request.from_id)
			from = 'Owner'
			if (!fromUser) {
				fromUser = await Editor_Gig.findById(request.from_id)
				from = 'Editor'
			}
			if (!fromUser) {
				fromUser = await Editor.findById(request.from_id)
				from = 'Editor'
			}
			if (!fromUser) {
				continue
			}

			// Find editor (to_id)
			let toUser
			let to
			toUser = await Editor_Gig.findById(request.to_id)
			to = 'Editor'
			if (!toUser) {
				toUser = await Editor.findById(request.to_id)
				to = 'Editor'
			}
			if (!toUser) {
				toUser = await Owner.findById(request.to_id)
				to = 'Owner'
			}
			if (!toUser) {
				continue
			}

			// Skip if neither owner nor editor is found
			if (!fromUser && !toUser) continue

			// Construct response object
			const processedRequest = {
				request_id: request._id,
				from: {
					id: request.from_id,
					name: from === 'Owner' ? fromUser.username : fromUser.name,
				},
				to: {
					id: request.to_id,
					name: to === 'Owner' ? toUser.username : toUser.name,
				},
				video: {
					url: request.video_id?.url || '',
					title: request.video_id?.metaData?.title || '',
				},
				description: request.description,
				price: request.price,
				status: request.status,
				createdAt: request.createdAt,
				updatedAt: request.updatedAt,
			}

			console.log('Processed request:', processedRequest)
			processedRequests.push(processedRequest)
		}

		return res.status(200).json({
			success: true,
			requests: processedRequests,
		})
	} catch (error) {
		console.error('Error in getAllUpdatedRequests:', error)
		return res.status(500).json({
			success: false,
			message: 'Error fetching requests',
			error: error.message,
		})
	}
}
