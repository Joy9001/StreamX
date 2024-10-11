import Editor_Gig from '../models/Editor_gig.js'
import editor_plans from '../models/Editor_gig_plans.js'

export const Editor_gig_plans = async (req, res) => {
	try {
		const { email, basic, standard, premium } = req.body

		// Check if the editor with the provided email exists
		const existingEditor = await Editor_Gig.findOne({ email })
		if (!existingEditor) {
			return res.status(404).json({
				success: false,
				message: 'No editor found with this email.',
			})
		}

		const updatedPlan = await editor_plans.findOneAndUpdate(
			{ email },
			{ basic, standard, premium }, // Update
			{ new: true, upsert: true }
		)

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
