import Editor from '../models/editor.models.js'

const GetEditorByEmail = async (req, res) => {
    const { email } = req.params
    console.log('Received request for editor with email:', email)

    try {
        const editor = await Editor.findOne({ email })
        console.log('Database query result:', editor)

        if (!editor) {
            console.log('No editor found for email:', email)
            return res.status(404).json({ message: 'Editor not found' })
        }

        console.log('Sending editor data:', editor)
        res.status(200).json(editor)
    } catch (err) {
        console.error('Error in GetEditorByEmail:', err)
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

export default GetEditorByEmail
