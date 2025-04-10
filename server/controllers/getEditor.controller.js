import Editor from '../models/editor.models.js'

export const EditorData = async (req, res) => {
	try {
		const editorData = await Editor.find()
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
