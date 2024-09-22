import Editor_Gig from "../model/Editor_gig.js";

export const Editor_gig_cont = async (req, res) => {
    try {
        const { name, email, address, languages, image, bio, skills, gig_description, rating } = req.body;

        // Check if an editor with the same email already exists
        const existingEditor = await Editor_Gig.findOne({ email });
        if (existingEditor) {
            return res.status(400).json({
                success: false,
                message: 'An editor with this email already exists.'
            });
        }

        // Create a new editor gig
        const new_editor = new Editor_Gig({
            name,
            email, // Include email in the new editor object
            address,
            languages,
            image,
            bio,
            skills,
            gig_description,
            rating
        });

        const savedEditorGig = await new_editor.save();

        res.status(201).json({
            success: true,
            data: savedEditorGig,
            message: 'Editor gig created successfully!'
        });
    } catch (error) {
        console.error('Error creating editor gig:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the editor gig.',
            error: error.message 
        });
    }
};
