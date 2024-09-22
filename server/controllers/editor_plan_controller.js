import editor_plans from "../model/Editor_gig_plans.js";
import Editor_Gig from "../model/Editor_gig.js";

export const Editor_gig_plans = async (req, res) => {
    try {
        const { email, basic, standard, premium } = req.body;

        // Check if the editor with the provided email exists
        const existingEditor = await Editor_Gig.findOne({ email });
        if (!existingEditor) {
            return res.status(404).json({
                success: false,
                message: 'No editor found with this email.',
            });
        }

        // Update the plan if it exists, or create a new one
        const updatedPlan = await editor_plans.findOneAndUpdate(
            { email }, // Filter
            { basic, standard, premium }, // Update
            { new: true, upsert: true } // Options
        );

        res.status(201).json({
            success: true,
            data: updatedPlan,
            message: 'Editor gig plan updated/created successfully!',
        });
    } catch (error) {
        console.error('Error updating/creating editor gig plan:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating/creating the editor gig plan.',
            error: error.message,
        });
    }
};

