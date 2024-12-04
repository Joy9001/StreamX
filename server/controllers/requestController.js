import Request from '../models/Request.js'
import Editor_Gig from '../models/Editor_gig.js'
import Editor from '../models/editor.models.js'

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
		console.log('to_id:', to_id)

		const findEditor = await Editor.findOne({ _id: to_id })

		let requests
		if (!findEditor) {
			requests = await Request.find({ to_id })
		} else {
			const gigProfile = await Editor_Gig.findOne({ email: findEditor.email })
			if (gigProfile) {
				const gig_id = gigProfile._id
				requests = await Request.find({ to_id: { $in: [gig_id, to_id] } })
			}
		}
		console.log('requests in getRequestsByToId:', requests)

		if (!requests) {
			return res.status(404).json({ message: 'Requests not found' })
		}

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
