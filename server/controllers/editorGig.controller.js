import EditorGig from '../models/editorGig.model.js'

export const createEditorGig = async (req, res) => {
	try {
		const { name, email, address, languages, image, bio, skills, gig_description, rating } = req.body

		// Check if an editor with the same email already exists
		const existingEditor = await EditorGig.findOne({ email })
		if (existingEditor) {
			return res.status(400).json({
				success: false,
				message: 'An editor with this email already exists.',
			})
		}

		// Create a new editor gig
		const new_editor = new EditorGig({
			name,
			email, // Include email in the new editor object
			address,
			languages,
			image,
			bio,
			skills,
			gig_description,
			rating,
		})

		const savedEditorGig = await new_editor.save()

		res.status(201).json({
			success: true,
			data: savedEditorGig,
			message: 'Editor gig created successfully!',
		})
	} catch (error) {
		console.error('Error creating editor gig:', error)
		res.status(500).json({
			success: false,
			message: 'An error occurred while creating the editor gig.',
			error: error.message,
		})
	}
}

// Get editor gig by email
export const getEditorGigByEmail = async (req, res) => {
	try {
		const { email } = req.params

		// Find editor gig by email
		let editorGig = await EditorGig.findOne({ email })

		// If editor gig doesn't exist, create one with default values
		if (!editorGig) {
			const defaultEditorGig = new EditorGig({
				name: '-',
				email: email,
				address: '-',
				languages: ['-'],
				image: null,
				bio: '-',
				skills: ['-'],
				gig_description: '-',
				rating: 0,
			})

			editorGig = await defaultEditorGig.save()

			return res.status(201).json({
				success: true,
				data: editorGig,
				message: 'Default editor gig created successfully!',
			})
		}

		res.status(200).json({
			success: true,
			data: editorGig,
			message: 'Editor gig retrieved successfully!',
		})
	} catch (error) {
		console.error('Error in getEditorGigByEmail:', error)
		res.status(500).json({
			success: false,
			message: 'An error occurred while fetching/creating the editor gig.',
			error: error.message,
		})
	}
}

// Update editor gig by email
export const updateEditorGigByEmail = async (req, res) => {
	try {
		const { email } = req.params
		const updateData = req.body

		// Find and update editor gig by email
		const updatedEditorGig = await EditorGig.findOneAndUpdate({ email }, updateData, {
			new: true,
			runValidators: true,
		})

		if (!updatedEditorGig) {
			return res.status(404).json({
				success: false,
				message: 'Editor gig not found with this email',
			})
		}

		res.status(200).json({
			success: true,
			data: updatedEditorGig,
			message: 'Editor gig updated successfully',
		})
	} catch (error) {
		console.error('Error updating editor gig:', error)
		res.status(500).json({
			success: false,
			message: 'Error updating editor gig',
			error: error.message,
		})
	}
}

export const getEditorGigData = async (req, res) => {
	try {
		const editorData = await EditorGig.find()
		if (!editorData) {
			return res.status(404).json({ message: 'No editor data found' })
		}
		console.log('Data retrieved successfully')
		res.status(200).json(editorData)
	} catch (err) {
		console.log('Error:', err)
		res.status(500).json({ error: err.message })
	}
}
