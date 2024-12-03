import Owner from '../models/owner.model.js'

export const getAllOwners = async (req, res) => {
  try {
    const owners = await Owner.find({})
    res.status(200).json(owners)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching owners', error })
  }
}

export const createOwner = async (req, res) => {
  try {
    const { username, email, password, YTchannelname, profilephoto, storageLimit } = req.body

    // Check if owner with email already exists
    const existingOwner = await Owner.findOne({ email })
    if (existingOwner) {
      return res.status(400).json({ message: 'Owner with this email already exists' })
    }

    const newOwner = new Owner({
      username,
      email,
      password,
      YTchannelname,
      profilephoto,
      storageLimit: storageLimit || 10 * 1024, // Default 10GB in KB
      providerSub: [] // Required field, initialize as empty array
    })

    await newOwner.save()
    res.status(201).json(newOwner)
  } catch (error) {
    res.status(500).json({ message: 'Error creating owner', error })
  }
}

export const deleteOwner = async (req, res) => {
  try {
    const { email } = req.params
    const owner = await Owner.findOneAndDelete({ email })

    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' })
    }

    res.status(200).json({ message: 'Owner deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting owner', error })
  }
}

export const getOwnerProfile = async (req, res) => {
	try {
		const { id } = req.params
		console.log('User:', id)
		const owner = await Owner.findOne({ _id: id })

		if (!owner) {
			return res.status(404).json({ message: 'Owner not found' })
		}

		console.log('Owner:', owner)
		const remainingStorage = owner.storageLimit - owner.usedStorage
		const storagePercentage = (owner.usedStorage / owner.storageLimit) * 100

		res.status(200).json({
			username: owner.username,
			email: owner.email,
			YTchannelname: owner.YTchannelname,
			profilephoto: owner.profilephoto,
			ytChannelLink: owner.ytChannelLink,
			requestCount: owner.requestCount,
			hiredEditors: owner.hiredEditors,
			videoIds: owner.videoIds,
			storageLimit: owner.storageLimit,
			usedStorage: owner.usedStorage,
			remainingStorage,
			storagePercentage: storagePercentage.toFixed(2),
		})
	} catch (error) {
		res.status(500).json({ message: 'Error fetching profile', error })
	}
}

export const getOwnerByEmail = async (req, res) => {
  try {
    const { email } = req.params
    const owner = await Owner.findOne({ email })

    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' })
    }

    // Convert storage from KB to GB for frontend
    const ownerData = owner.toObject()
    ownerData.storageLimit = ownerData.storageLimit / 1024 // Convert KB to GB

    res.status(200).json(ownerData)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching owner', error: error.message })
  }
}

export const updateOwner = async (req, res) => {
  try {
    const { email } = req.params
    const updateData = req.body

    // Convert storage limit to KB if provided
    if (updateData.storageLimit) {
      updateData.storageLimit = parseInt(updateData.storageLimit) * 1024 // Convert GB to KB
    }

    // Remove password field if it's empty
    if (!updateData.password) {
      delete updateData.password
    }

    const owner = await Owner.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true, runValidators: true }
    )

    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' })
    }

    res.status(200).json(owner)
  } catch (error) {
    res.status(500).json({ message: 'Error updating owner', error: error.message })
  }
}
