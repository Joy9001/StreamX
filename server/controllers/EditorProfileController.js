import EditorProfile from '../models/EditorProfile.js'

export const createEditorProfile = async (req, res) => {
	const { name, email, phone, location, image, software, specializations } = req.body

	try {
		const existingEditor = await EditorProfile.findOne({ email })
		console.log('existingEditor:', existingEditor)
		if (existingEditor) {
			return res.status(400).json({ message: 'Editor with this email already exists.' })
		}

		const newEditor = new EditorProfile({
			name,
			email,
			phone,
			location,
			image,
			software,
			specializations,
		})

		await newEditor.save()

		res.status(201).json(newEditor)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Error creating editor profile', error })
	}
}
