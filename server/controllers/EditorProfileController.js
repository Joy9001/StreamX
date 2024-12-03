import EditorGig from '../models/Editor_gig.js'
import mongoose from 'mongoose'
import { StatusCodes } from 'http-status-codes'

export const createEditorProfile = async (req, res) => {
	const { name, email, phone, location, image, software, specializations } = req.body

	try {
		const existingEditor = await EditorGig.findOne({ email })
		console.log('existingEditor:', existingEditor)
		if (existingEditor) {
			return res.status(400).json({ message: 'Editor with this email already exists.' })
		}

		const newEditor = new EditorGig({
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

// Get editor name by ID
export const getEditorNameById = async (req, res) => {
    try {
        const { editorId } = req.params
        console.log('Looking for editor ID:', editorId)
        
        // Get all editors
        const editors = await EditorGig.find({})
        console.log('Found editors:', editors.length)
        
        // Log all editor IDs for comparison
        editors.forEach(ed => {
            console.log('Editor in DB:', {
                id: ed._id.toString(),
                name: ed.name,
                email: ed.email
            })
        })
        
        // Try to find the editor by comparing string versions of IDs
        const editor = editors.find(ed => ed._id.toString() === editorId)
        
        if (!editor) {
            console.log('No matching editor found')
            return res.status(404).json({ message: 'Editor not found' })
        }

        // If name is not available, use email as fallback
        const displayName = editor.name || editor.email || 'Unknown Editor'
        console.log('Found editor:', displayName)
        return res.status(200).json({ name: displayName })
    } catch (error) {
        console.error('Error fetching editor name:', error)
        return res.status(500).json({ 
            message: 'Failed to fetch editor name', 
            error: error.message 
        })
    }
}
