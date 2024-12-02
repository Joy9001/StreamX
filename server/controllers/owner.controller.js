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
