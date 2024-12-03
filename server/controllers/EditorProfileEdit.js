import Editor from '../models/editor.models.js'
const updateEditor = async (req, res) => {
	const { email } = req.params // Get email from URL parameter
	const updatedData = req.body // Get updated data from request body

	try {
		const editor = await Editor.findOneAndUpdate({ email }, updatedData, { new: true })

		if (!editor) {
			return res.status(404).json({ message: 'Editor not found' })
		}

		res.status(200).json(editor)
	} catch (error) {
		res.status(500).json({ message: 'Server error', error })
	}
}
export default updateEditor
