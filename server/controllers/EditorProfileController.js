import EditorGig from '../models/Editor_gig.js'
import Owner from '../models/owner.model.js'
import Video from '../models/video.model.js'

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
		editors.forEach((ed) => {
			console.log('Editor in DB:', {
				id: ed._id.toString(),
				name: ed.name,
				email: ed.email,
			})
		})

		// Try to find the editor by comparing string versions of IDs
		const editor = editors.find((ed) => ed._id.toString() === editorId)

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
			error: error.message,
		})
	}
}

export const getHiredByOwners = async (req, res) => {
    try {
        const { editorId } = req.params

        const findVideos = await Video.find({ editorId: editorId })

        if (!findVideos) {
            return res.status(404).json({ message: 'Videos not found' })
        }

        let ownerIds = []
        for (let i = 0; i < findVideos.length; i++) {
            ownerIds.push(findVideos[i].ownerId)
        }

        const owners = await Owner.find({ _id: { $in: ownerIds } })

        if (!owners) {
            return res.status(404).json({ message: 'Owners not found' })
        }

        res.status(200).json(owners)
    } catch (error) {
        console.error('Error fetching hired editors:', error)
        res.status(500).json({ message: 'Error fetching hired editors', error: error.message })
    }
}