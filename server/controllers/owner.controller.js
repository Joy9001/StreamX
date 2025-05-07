import Editor from '../models/editor.model.js'
import Owner from '../models/owner.model.js'
import Video from '../models/video.model.js'
import cacheService from '../services/cache.service.js'

export const getAllOwners = async (req, res) => {
	const cacheKey = cacheService.generateKey('allOwners')
	try {
		const cachedOwners = await cacheService.get(cacheKey)
		if (cachedOwners) {
			return res.status(200).json(cachedOwners)
		}

		const owners = await Owner.find({}).lean()

		if (owners) {
			await cacheService.set(cacheKey, owners, cacheService.TTL.LIST)
		}

		res.status(200).json(owners || [])
	} catch (error) {
		console.error('Error fetching all owners:', error)
		res.status(500).json({ message: 'Error fetching owners', error: error.message })
	}
}

export const createOwner = async (req, res) => {
	try {
		const { username, email, password, YTchannelname, profilephoto, storageLimit } = req.body

		if (!email || !username || !password) {
			return res.status(400).json({ message: 'Missing required fields: username, email, password' })
		}

		const existingOwner = await Owner.findOne({ email }).lean()
		if (existingOwner) {
			return res.status(400).json({ message: 'Owner with this email already exists' })
		}

		const newOwner = new Owner({
			username,
			email,
			password,
			YTchannelname,
			profilephoto,
			storageLimit: storageLimit ? parseInt(storageLimit) * 1024 : 10 * 1024,
			providerSub: [],
		})

		await newOwner.save()

		await cacheService.invalidateOwnerCaches({ ownerId: newOwner._id, email: newOwner.email })

		const responseData = newOwner.toObject()
		if (responseData.storageLimit) {
			responseData.storageLimit = responseData.storageLimit / 1024
		}
		delete responseData.password

		res.status(201).json(responseData)
	} catch (error) {
		console.error('Error creating owner:', error)
		if (error.name === 'ValidationError') {
			return res.status(400).json({ message: 'Validation Error', errors: error.errors })
		}
		res.status(500).json({ message: 'Error creating owner', error: error.message })
	}
}

export const deleteOwner = async (req, res) => {
	try {
		const { email } = req.params
		if (!email) {
			return res.status(400).json({ message: 'Email parameter is required' })
		}

		const owner = await Owner.findOne({ email }).select('_id').lean()
		if (!owner) {
			return res.status(404).json({ message: 'Owner not found' })
		}
		const ownerId = owner._id.toString()

		const deleteResult = await Owner.deleteOne({ email })

		if (deleteResult.deletedCount === 0) {
			return res.status(404).json({ message: 'Owner not found during deletion attempt' })
		}

		await cacheService.invalidateOwnerCaches({ ownerId, email })

		res.status(200).json({ message: 'Owner deleted successfully' })
	} catch (error) {
		console.error(`Error deleting owner with email ${email}:`, error)
		res.status(500).json({ message: 'Error deleting owner', error: error.message })
	}
}

export const getOwnerProfile = async (req, res) => {
	const { id } = req.params
	if (!id) {
		return res.status(400).json({ message: 'ID parameter is required' })
	}
	const cacheKey = cacheService.generateKey('ownerProfile', { id })

	try {
		const cachedProfile = await cacheService.get(cacheKey)
		if (cachedProfile) {
			return res.status(200).json(cachedProfile)
		}

		const owner = await Owner.findById(id).select('-password').lean()

		if (!owner) {
			return res.status(404).json({ message: 'Owner not found' })
		}

		const remainingStorage = (owner.storageLimit || 0) - (owner.usedStorage || 0)
		const storagePercentage = owner.storageLimit > 0 ? ((owner.usedStorage || 0) / owner.storageLimit) * 100 : 0

		const profileData = {
			...owner,
			storageLimit: (owner.storageLimit || 0) / 1024,
			usedStorage: (owner.usedStorage || 0) / 1024,
			remainingStorage: remainingStorage / 1024,
			storagePercentage: storagePercentage.toFixed(2),
		}

		const cacheData = {
			...owner,
			remainingStorage: remainingStorage,
			storagePercentage: storagePercentage.toFixed(2),
		}
		await cacheService.set(cacheKey, cacheData, cacheService.TTL.SINGLE)

		res.status(200).json(profileData)
	} catch (error) {
		console.error(`Error fetching profile for owner ID ${id}:`, error)
		if (error.name === 'CastError') {
			return res.status(400).json({ message: 'Invalid Owner ID format' })
		}
		res.status(500).json({ message: 'Error fetching profile', error: error.message })
	}
}

export const getOwnerByEmail = async (req, res) => {
	const { email } = req.params
	if (!email) {
		return res.status(400).json({ message: 'Email parameter is required' })
	}
	const cacheKey = cacheService.generateKey('ownerByEmail', { email })

	try {
		const cachedOwner = await cacheService.get(cacheKey)
		if (cachedOwner) {
			const responseData = { ...cachedOwner }
			responseData.storageLimit = (responseData.storageLimit || 0) / 1024
			delete responseData.password
			return res.status(200).json(responseData)
		}

		const owner = await Owner.findOne({ email }).select('-password').lean()

		if (!owner) {
			return res.status(404).json({ message: 'Owner not found' })
		}

		await cacheService.set(cacheKey, owner, cacheService.TTL.SINGLE)

		const ownerData = { ...owner }
		ownerData.storageLimit = (ownerData.storageLimit || 0) / 1024

		res.status(200).json(ownerData)
	} catch (error) {
		console.error(`Error fetching owner by email ${email}:`, error)
		res.status(500).json({ message: 'Error fetching owner', error: error.message })
	}
}

export const updateOwner = async (req, res) => {
	try {
		const { email } = req.params
		if (!email) {
			return res.status(400).json({ message: 'Email parameter is required' })
		}
		const updateData = req.body

		if (updateData.storageLimit !== undefined) {
			updateData.storageLimit = Math.max(0, parseInt(updateData.storageLimit) * 1024)
		}

		if (updateData.password === '' || updateData.password === null || updateData.password === undefined) {
			delete updateData.password
		}

		const updatedOwner = await Owner.findOneAndUpdate(
			{ email },
			{ $set: updateData },
			{ new: true, runValidators: true }
		)
			.select('-password')
			.lean()

		if (!updatedOwner) {
			return res.status(404).json({ message: 'Owner not found' })
		}

		await cacheService.invalidateOwnerCaches({ ownerId: updatedOwner._id, email: updatedOwner.email })

		const responseData = { ...updatedOwner }
		responseData.storageLimit = (responseData.storageLimit || 0) / 1024

		res.status(200).json(responseData)
	} catch (error) {
		console.error(`Error updating owner with email ${req.params.email}:`, error)
		if (error.name === 'ValidationError') {
			return res.status(400).json({ message: 'Validation Error', errors: error.errors })
		}
		res.status(500).json({ message: 'Error updating owner', error: error.message })
	}
}

export const getHiredEditors = async (req, res) => {
	const { ownerId } = req.params
	if (!ownerId) {
		return res.status(400).json({ message: 'Owner ID parameter is required' })
	}
	const cacheKey = cacheService.generateKey('hiredEditors', { ownerId })

	try {
		const cachedEditors = await cacheService.get(cacheKey)
		if (cachedEditors) {
			console.log(`Cache hit for hired editors: ${ownerId}`)
			return res.status(200).json(cachedEditors)
		}
		console.log(`Cache miss for hired editors: ${ownerId}`)

		const editorIds = await Video.distinct('editorId', { ownerId: ownerId, editorId: { $ne: null } })
		console.log('Distinct editor IDs found for owner:', ownerId, editorIds)

		if (!editorIds || editorIds.length === 0) {
			await cacheService.set(cacheKey, [], cacheService.TTL.LIST)
			return res.status(200).json([])
		}

		const editors = await Editor.find({ _id: { $in: editorIds } })
			.select('-password')
			.lean()

		console.log('Editor details fetched for owner:', ownerId, editors)

		await cacheService.set(cacheKey, editors, cacheService.TTL.LIST)

		res.status(200).json(editors)
	} catch (error) {
		console.error(`Error fetching hired editors for owner ${ownerId}:`, error)
		if (error.name === 'CastError') {
			return res.status(400).json({ message: 'Invalid Owner ID format' })
		}
		res.status(500).json({ message: 'Error fetching hired editors', error: error.message })
	}
}

export const getOwnerNameById = async (req, res) => {
	const { id } = req.params
	if (!id) {
		return res.status(400).json({ message: 'ID parameter is required' })
	}
	const cacheKey = cacheService.generateKey('ownerName', { id })

	try {
		const cachedName = await cacheService.get(cacheKey)
		if (cachedName) {
			return res.status(200).json(cachedName)
		}

		const owner = await Owner.findById(id).select('username').lean()

		if (!owner) {
			return res.status(404).json({ message: 'Owner not found' })
		}

		const nameData = { name: owner.username }

		await cacheService.set(cacheKey, nameData, cacheService.TTL.SINGLE)

		res.status(200).json(nameData)
	} catch (error) {
		console.error(`Error fetching owner name for ID ${id}:`, error)
		if (error.name === 'CastError') {
			return res.status(400).json({ message: 'Invalid Owner ID format' })
		}
		res.status(500).json({ message: 'Error fetching owner name', error: error.message })
	}
}
