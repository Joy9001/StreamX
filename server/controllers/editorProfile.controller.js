import Editor from '../models/editor.model.js'
import EditorGig from '../models/editorGig.model.js'
import Owner from '../models/owner.model.js'
import Video from '../models/video.model.js'
import cacheService from '../services/cache.service.js'

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

		await cacheService.invalidateEditorGigCaches(email)

		res.status(201).json(newEditor)
	} catch (error) {
		console.error('Error creating editor profile:', error)
		res.status(500).json({ message: 'Error creating editor profile', error: error.message })
	}
}

export const getEditorNameById = async (req, res) => {
	const { editorId } = req.params
	const cacheKey = cacheService.generateKey('editorName', { editorId })

	try {
		const cachedData = await cacheService.get(cacheKey)
		if (cachedData) {
			console.log('Cache hit for editor name:', editorId)
			return res.status(200).json(cachedData)
		}
		console.log('Cache miss for editor name:', editorId)

		console.log('Looking for editor ID:', editorId)

		let editor = await EditorGig.findById(editorId).select('name email')

		if (!editor) {
			editor = await Editor.findById(editorId).select('name email')
		}

		if (!editor) {
			return res.status(404).json({ message: 'Editor not found' })
		}

		const displayName = editor.name || editor.email || 'Unknown Editor'
		const result = { name: displayName }
		console.log('Found editor:', displayName)

		await cacheService.set(cacheKey, result, cacheService.TTL.SINGLE)

		return res.status(200).json(result)
	} catch (error) {
		console.error('Error fetching editor name:', error)
		return res.status(500).json({
			message: 'Failed to fetch editor name',
			error: error.message,
		})
	}
}

export const getHiredByOwners = async (req, res) => {
	const { editorId } = req.params
	const cacheKey = cacheService.generateKey('hiredByOwners', { editorId })

	try {
		const cachedData = await cacheService.get(cacheKey)
		if (cachedData) {
			console.log('Cache hit for hiredByOwners:', editorId)
			return res.status(200).json(cachedData)
		}
		console.log('Cache miss for hiredByOwners:', editorId)

		const findVideos = await Video.find({ editorId: editorId }).select('ownerId')

		if (!findVideos || findVideos.length === 0) {
			await cacheService.set(cacheKey, [], cacheService.TTL.LIST)
			return res.status(200).json([])
		}

		let ownerIds = findVideos.filter((video) => video.ownerId).map((video) => video.ownerId)
		ownerIds = [...new Set(ownerIds.map((id) => id.toString()))]

		if (ownerIds.length === 0) {
			await cacheService.set(cacheKey, [], cacheService.TTL.LIST)
			return res.status(200).json([])
		}

		const owners = await Owner.find({ _id: { $in: ownerIds } }).select('name email profileImage')

		await cacheService.set(cacheKey, owners, cacheService.TTL.LIST)

		res.status(200).json(owners)
	} catch (error) {
		console.error('Error fetching hired by owners:', error)
		res.status(500).json({ message: 'Error fetching hired by owners', error: error.message })
	}
}

export const deleteEditorByEmail = async (req, res) => {
	const { email } = req.params

	try {
		const editor = await Editor.findOneAndDelete({ email }).select('_id')

		if (!editor) {
			return res.status(404).json({ message: 'Editor not found' })
		}

		await cacheService.invalidateEditorCaches({ editorId: editor._id.toString(), email })

		res.status(200).json({ message: `Editor with email ${email} deleted successfully` })
	} catch (error) {
		console.error('Error deleting editor:', error)
		res.status(500).json({ message: 'Failed to delete editor', error: error.message })
	}
}

export const updateEditor = async (req, res) => {
	const { email } = req.params
	const updatedData = req.body

	try {
		const editor = await Editor.findOneAndUpdate({ email }, updatedData, { new: true }).select('_id email')

		if (!editor) {
			return res.status(404).json({ message: 'Editor not found' })
		}

		await cacheService.invalidateEditorCaches({ editorId: editor._id.toString(), email: editor.email })

		res.status(200).json(editor)
	} catch (error) {
		console.error('Error updating editor:', error)
		res.status(500).json({ message: 'Server error updating editor', error: error.message })
	}
}

export const getEditorByEmail = async (req, res) => {
	const { email } = req.params
	const cacheKey = cacheService.generateKey('editor', { email })
	console.log('Received request for editor with email:', email)

	try {
		const cachedData = await cacheService.get(cacheKey)
		if (cachedData) {
			console.log('Cache hit for editor:', email)
			return res.status(200).json(cachedData)
		}
		console.log('Cache miss for editor:', email)

		const editor = await Editor.findOne({ email })
		console.log('Database query result:', editor)

		if (!editor) {
			console.log('No editor found for email:', email)
			await cacheService.set(cacheKey, null, cacheService.TTL.RECENT)
			return res.status(404).json({ message: 'Editor not found' })
		}

		await cacheService.set(cacheKey, editor, cacheService.TTL.SINGLE)

		console.log('Sending editor data:', editor)
		res.status(200).json(editor)
	} catch (err) {
		console.error('Error in getEditorByEmail:', err)
		res.status(500).json({ message: 'Server error', error: err.message })
	}
}
