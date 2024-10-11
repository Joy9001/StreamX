import EditorProfile from '../models/EditorProfile.js'

const deleteEditorByEmail = async (req, res) => {
	const { email } = req.params

	try {
		const editor = await EditorProfile.findOneAndDelete({ email })

		if (!editor) {
			return res.status(404).json({ message: 'Editor not found' })
		}

		res.status(200).json({ message: `Editor with email ${email} deleted successfully` })
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Failed to delete editor', error })
	}
}

export default deleteEditorByEmail
