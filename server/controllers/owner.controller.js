import Owner from '../models/owner.model.js'

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
