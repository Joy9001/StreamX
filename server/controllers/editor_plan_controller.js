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

// Get editor gig plans by email
export const getEditorGigPlansByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        // Find the editor's gig plans
        let editorPlans = await editor_plans.findOne({ email });
        
        // If no plans exist, create default plans
        if (!editorPlans) {
            const defaultPlans = {
                email,
                basic: {
                    price: 0,
                    desc: "-",
                    deliveryTime: 0,
                    services: ["-"]
                },
                standard: {
                    price: 0,
                    desc: "-",
                    deliveryTime: 0,
                    services: ["-"]
                },
                premium: {
                    price: 0,
                    desc: "-",
                    deliveryTime: 0,
                    services: ["-"]
                }
            };

            editorPlans = await editor_plans.create(defaultPlans);
            
            return res.status(201).json({
                success: true,
                data: editorPlans,
                message: 'Default gig plans created successfully!'
            });
        }

        res.status(200).json({
            success: true,
            data: editorPlans,
            message: 'Editor gig plans retrieved successfully!'
        });
    } catch (error) {
        console.error('Error in getEditorGigPlansByEmail:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching/creating the editor gig plans.',
            error: error.message
        });
    }
}

// Update editor gig plans by email
export const updateEditorGigPlansByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const { basic, standard, premium } = req.body;

        // Find and update the plans
        const updatedPlans = await editor_plans.findOneAndUpdate(
            { email },
            { basic, standard, premium },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: updatedPlans,
            message: 'Editor gig plans updated successfully'
        });
    } catch (error) {
        console.error('Error updating editor gig plans:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating editor gig plans',
            error: error.message
        });
    }
}
