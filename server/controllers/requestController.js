import Admin from '../models/admin.model.js'
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
		console.log('Received request params:', req.params)
		const { to_id } = req.params
		console.log('Searching for requests with to_id:', to_id)

		let requests = await Request.find({ to_id }).populate({
			path: 'video_id',
			select: 'url metaData _id',
		})
		console.log('Initial requests found:', requests.length)

		if (!requests || requests.length === 0) {
			console.log('No direct requests found, attempting alternative lookup')
			const findEditor = await Editor.findById(to_id)
			console.log('Found editor:', findEditor ? findEditor.name : 'No editor found')

			if (!findEditor) {
				console.log('No editor found with given ID')
				return res.status(404).json({ message: 'Editor not found' })
			}

			const findEditorGig = await Editor_Gig.findOne({ email: findEditor.email })
			console.log('Found editor gig:', findEditorGig ? findEditorGig._id : 'No editor gig found')

			if (!findEditorGig) {
				return res.status(404).json({ message: 'Editor gig not found' })
			}

			requests = await Request.find({ to_id: findEditorGig._id }).populate({
				path: 'video_id',
				select: 'url metaData _id',
			})
			console.log('Requests found after alternative lookup:', requests.length)
		}

		if (!requests || requests.length === 0) {
			console.log('No requests found after all attempts')
			return res.status(404).json({ message: 'Requests not found' })
		}

		let processedRequests = []
		for (const request of requests) {
			console.log('Processing request:', request._id)

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
			console.log(
				'From user found:',
				fromUser ? `${from}: ${fromUser.name || fromUser.username}` : 'No from user found'
			)

			if (!fromUser) {
				console.log('Skipping request due to no from user')
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
			console.log('To user found:', toUser ? `${to}: ${toUser.name || toUser.username}` : 'No to user found')

			if (!toUser) {
				console.log('Skipping request due to no to user')
				continue
			}

			// Skip if neither owner nor editor is found
			if (!fromUser && !toUser) {
				console.log('Skipping request - no from or to user')
				continue
			}

			// Construct response object
			const processedRequest = {
				_id: request._id,
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
					title: request.video_id?.metaData?.name || '',
					_id: request.video_id?._id,
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

		console.log('Total processed requests:', processedRequests.length)
		res.status(200).json(processedRequests)
	} catch (error) {
		console.error('Error fetching owner requests:', error)
		res.status(500).json({ message: 'Error fetching owner requests', error: error.message })
	}
}

// Get requests by editor ID
export const getRequestsByFromId = async (req, res) => {
	try {
		console.log('Received request params:', req.params)
		const { from_id } = req.params
		console.log('Searching for requests with from_id:', from_id)

		let requests = await Request.find({ from_id }).populate({
			path: 'video_id',
			select: 'url metaData _id',
		})
		console.log('Initial requests found:', requests.length)

		if (!requests || requests.length === 0) {
			return res.status(404).json({ message: 'Requests not found' })
		}

		let processedRequests = []
		for (const request of requests) {
			console.log('Processing request:', request._id)

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
			console.log(
				'From user found:',
				fromUser ? `${from}: ${fromUser.name || fromUser.username}` : 'No from user found'
			)

			if (!fromUser) {
				console.log('Skipping request due to no from user')
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
			console.log('To user found:', toUser ? `${to}: ${toUser.name || toUser.username}` : 'No to user found')

			if (!toUser) {
				console.log('Skipping request due to no to user')
				continue
			}

			// Skip if neither owner nor editor is found
			if (!fromUser && !toUser) {
				console.log('Skipping request - no from or to user')
				continue
			}

			// Construct response object
			const processedRequest = {
				_id: request._id,
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
					title: request.video_id?.metaData?.name || '',
					_id: request.video_id?._id,
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

		console.log('Total processed requests:', processedRequests.length)
		res.status(200).json(processedRequests)
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

		let processedRequests = []

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
					title: request.video_id?.metaData?.name || '',
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

export const getAdminRequests = async (req, res) => {
	try {
		// Find admin users
		const adminUsers = await Admin.find({ role: 'admin' })
		const adminIds = adminUsers.map((admin) => admin._id)

		// Fetch all requests with populated video data where to_id is an admin
		const requests = await Request.find({ to_id: { $in: adminIds } }).populate({
			path: 'video_id',
			select: 'url metaData ytUploadStatus',
		})

		let processedRequests = []

		// Process each request
		for (const request of requests) {
			console.log('Processing request in getAdminRequests:', request)
			// Find owner (from_id)
			let from
			let fromUser
			fromUser = await Owner.findById(request.from_id)
			from = 'Owner'
			if (!fromUser) {
				continue
			}

			// Find admin (to_id)
			const toUser = await Admin.findById(request.to_id)
			if (!toUser) {
				continue
			}

			// Skip if neither owner nor admin is found
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
					name: toUser.username,
				},
				video: {
					id: request.video_id?._id,
					url: request.video_id?.url || '',
					title: request.video_id?.metaData?.name || '',
					ytUploadStatus: request.video_id?.ytUploadStatus || '',
				},
				description: request.description,
				price: request.price,
				status: request.status,
				createdAt: request.createdAt,
				updatedAt: request.updatedAt,
			}

			processedRequests.push(processedRequest)
		}

		return res.status(200).json({
			success: true,
			requests: processedRequests,
		})
	} catch (error) {
		console.error('Error in getAdminRequests:', error)
		return res.status(500).json({
			success: false,
			message: 'Error fetching admin requests',
			error: error.message,
		})
	}
}

export const aggregateRequestsController = async (req, res) => {
	const { fromId } = req.params
	try {
		const requests = await Request.find({ from_id: fromId })

		let totalRequests = 0
		let totalPendingRequests = 0
		let totalApprovedRequests = 0
		let totalRejectedRequests = 0

		requests.forEach((request) => {
			totalRequests++
			if (request.status === 'pending') {
				totalPendingRequests++
			} else if (request.status === 'approved') {
				totalApprovedRequests++
			} else if (request.status === 'rejected') {
				totalRejectedRequests++
			}
		})

		const response = {
			totalRequests,
			totalPendingRequests,
			totalApprovedRequests,
			totalRejectedRequests,
		}

		console.log(response)
		return res.status(200).json(response)
	} catch (error) {
		console.error('Error fetching requests:', error)
		res.status(500).json({ message: 'Error fetching requests', error: error.message })
	}
}
