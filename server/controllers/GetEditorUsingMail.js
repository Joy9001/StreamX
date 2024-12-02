import Editor from '../models/editor.models.js'

const GetEditorByEmail = async (req, res) => {
	const { email } = req.params

	try {
		// Find editor by email
		const editor = await Editor.findOne({ email })

		if (!editor) {
			return res.status(404).json({ message: 'Editor not found' })
		}

		res.status(200).json(editor)
	} catch (err) {
		console.error('Error fetching editor data:', err)
		res.status(500).json({ message: 'Server error' })
	}
}
export default GetEditorByEmail
