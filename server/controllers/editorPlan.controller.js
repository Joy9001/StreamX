import EditorGig from '../models/editorGig.model.js'
import EditorGigPlans from '../models/editorGigPlans.model.js'
import cacheService from '../services/cache.service.js'

export const updateEditorGigPlans = async (req, res) => {
	try {
		const { email, basic, standard, premium } = req.body

		// Check if the editor with the provided email exists
		const existingEditor = await EditorGig.findOne({ email })
		if (!existingEditor) {
			return res.status(404).json({
				success: false,
				message: 'No editor found with this email.',
			})
		}

		const updatedPlan = await EditorGigPlans.findOneAndUpdate(
			{ email },
			{ basic, standard, premium }, // Update
			{ new: true, upsert: true }
		)

		await cacheService.invalidateEditorPlanCaches(email)

		res.status(201).json({
			success: true,
			data: updatedPlan,
			message: 'Editor gig plan updated/created successfully!',
		})
	} catch (error) {
		console.error('Error updating/creating editor gig plan:', error)
		res.status(500).json({
			success: false,
			message: 'An error occurred while updating/creating the editor gig plan.',
			error: error.message,
		})
	}
}

// Get editor gig plans by email
export const getEditorGigPlansByEmail = async (req, res) => {
	const { email } = req.params
	const cacheKey = cacheService.generateKey('editorPlans', { email })

	try {
		const cachedPlans = await cacheService.get(cacheKey)
		if (cachedPlans) {
			return res.status(200).json({
				success: true,
				data: cachedPlans,
				message: 'Editor gig plans retrieved successfully from cache!',
			})
		}

		// Cache miss: Find the editor's gig plans
		let editorPlans = await EditorGigPlans.findOne({ email })
		let statusCode = 200
		let message = 'Editor gig plans retrieved successfully!'

		// If no plans exist, create default plans
		if (!editorPlans) {
			const defaultPlans = {
				email,
				basic: {
					price: 0,
					desc: '-',
					deliveryTime: 0,
					services: ['-'],
				},
				standard: {
					price: 0,
					desc: '-',
					deliveryTime: 0,
					services: ['-'],
				},
				premium: {
					price: 0,
					desc: '-',
					deliveryTime: 0,
					services: ['-'],
				},
			}

			editorPlans = await EditorGigPlans.create(defaultPlans)
			statusCode = 201
			message = 'Default gig plans created successfully!'
		}

		await cacheService.set(cacheKey, editorPlans, cacheService.TTL.DEFAULT)

		res.status(statusCode).json({
			success: true,
			data: editorPlans,
			message: message,
		})
	} catch (error) {
		console.error('Error in getEditorGigPlansByEmail:', error)
		res.status(500).json({
			success: false,
			message: 'An error occurred while fetching/creating the editor gig plans.',
			error: error.message,
		})
	}
}

// Update editor gig plans by email
export const updateEditorGigPlansByEmail = async (req, res) => {
	const { email } = req.params
	const { basic, standard, premium } = req.body

	try {
		// Find and update the plans
		const updatedPlans = await EditorGigPlans.findOneAndUpdate(
			{ email },
			{ basic, standard, premium },
			{ new: true, upsert: true, runValidators: true }
		)

		await cacheService.invalidateEditorPlanCaches(email)

		res.status(200).json({
			success: true,
			data: updatedPlans,
			message: 'Editor gig plans updated successfully',
		})
	} catch (error) {
		console.error('Error updating editor gig plans:', error)
		res.status(500).json({
			success: false,
			message: 'Error updating editor gig plans',
			error: error.message,
		})
	}
}

export const getEditorGigPlans = async (req, res) => {
	const cacheKey = cacheService.generateKey('editorPlans', { key: 'all' })

	try {
		const cachedData = await cacheService.get(cacheKey)
		if (cachedData) {
			console.log('All editor plan data retrieved successfully from cache')
			return res.status(200).json(cachedData)
		}

		// Cache miss: Fetch from DB
		const editorPlanData = await EditorGigPlans.find()
		if (!editorPlanData || editorPlanData.length === 0) {
			await cacheService.set(cacheKey, [], cacheService.TTL.LIST)
			return res.status(404).json({ message: 'No editor plan data found' })
		}

		await cacheService.set(cacheKey, editorPlanData, cacheService.TTL.LIST)

		console.log('All editor plan data retrieved successfully from DB')
		res.status(200).json(editorPlanData)
	} catch (err) {
		console.log('Error fetching all editor plans:', err)
		res.status(500).json({ error: err.message })
	}
}
