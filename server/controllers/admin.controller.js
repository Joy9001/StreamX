import Editor from '../models/editor.models.js'
import Owner from '../models/owner.model.js'

export const getAllOwners = async (req, res) => {
	try {
		const owners = await Owner.find({}, 'username email profilephoto ytChannelname')
		return res.status(200).json({
			success: true,
			message: 'Owners retrieved successfully',
			owners,
		})
	} catch (error) {
		console.error('Error retrieving owners:', error)
		return res.status(500).json({
			success: false,
			message: 'Failed to retrieve owners',
			error: error.message,
		})
	}
}

export const getAllEditors = async (req, res) => {
	try {
		const editors = await Editor.find({}, 'name email profilephoto')
		return res.status(200).json({
			success: true,
			message: 'Editors retrieved successfully',
			editors,
		})
	} catch (error) {
		console.error('Error retrieving editors:', error)
		return res.status(500).json({
			success: false,
			message: 'Failed to retrieve editors',
			error: error.message,
		})
	}
}
