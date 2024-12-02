import Request from '../models/Request.js'

// Create a new request
export const createRequest = async (req, res) => {
	try {
		const { editor_id, video_id, owner_id, description, price, status } = req.body

		// Create new request
		const newRequest = new Request({
			editor_id,
			video_id,
			owner_id,
			description,
			price,
			status: status || 'pending', // Default to pending if not provided
		})

		// Save the request
		const savedRequest = await newRequest.save()
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
export const getRequestsByOwnerId = async (req, res) => {
	try {
		const { owner_id } = req.params
		const requests = await Request.find({ owner_id })
		res.status(200).json(requests)
	} catch (error) {
		console.error('Error fetching owner requests:', error)
		res.status(500).json({ message: 'Error fetching owner requests', error: error.message })
	}
}

// Get requests by editor ID
export const getRequestsByEditorId = async (req, res) => {
	try {
		const { editor_id } = req.params
		const requests = await Request.find({ editor_id })
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

// export { createRequest, getAllRequests, getRequestsByOwnerId, getRequestsByEditorId, updateRequestStatus };
