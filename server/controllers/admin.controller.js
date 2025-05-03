import Admin from '../models/admin.model.js'
import Editor from '../models/editor.models.js'
import Owner from '../models/owner.model.js'
import Request from '../models/request.model.js'

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

export const getAllRequests = async (req, res) => {
	try {
		const requests = await Request.find()
			.populate({
				path: 'video_id',
				select: 'url metaData',
			})
			.select('from_id to_id video_id description price status createdAt updatedAt')
			.lean()

		if (!requests || requests.length === 0) {
			return res.status(200).json({ success: true, requests: [] })
		}

		const userIds = Array.from(
			new Set(requests.flatMap((r) => [r.from_id?.toString(), r.to_id?.toString()]).filter(Boolean))
		)

		const [usersAsOwners, usersAsEditors, usersAsAdmins] = await Promise.all([
			Owner.find({ _id: { $in: userIds } })
				.select('username _id')
				.lean(),
			Editor.find({ _id: { $in: userIds } })
				.select('name _id')
				.lean(),
			Admin.find({ _id: { $in: userIds } })
				.select('username _id')
				.lean(),
		])

		const userMap = new Map()
		usersAsOwners.forEach((u) => userMap.set(u._id.toString(), { name: u.username, kind: 'Owner' }))
		usersAsEditors.forEach((u) => userMap.set(u._id.toString(), { name: u.name, kind: 'Editor' }))
		usersAsAdmins.forEach((u) => userMap.set(u._id.toString(), { name: u.username, kind: 'Admin' }))

		const processedRequests = requests
			.map((r) => {
				const from = userMap.get(r.from_id?.toString())
				const to = userMap.get(r.to_id?.toString())
				if (!from || !to) return null

				return {
					request_id: r._id,
					from: { id: r.from_id, name: from.name, role: from.kind },
					to: { id: r.to_id, name: to.name, role: to.kind },
					video: {
						url: r.video_id?.url || '',
						title: r.video_id?.metaData?.name || '',
						_id: r.video_id?._id,
					},
					description: r.description,
					price: r.price,
					status: r.status,
					createdAt: r.createdAt,
					updatedAt: r.updatedAt,
				}
			})
			.filter(Boolean)

		return res.status(200).json({ success: true, requests: processedRequests })
	} catch (error) {
		console.error('Error in getAllRequests:', error)
		return res.status(500).json({
			success: false,
			message: 'Error fetching requests',
			error: error.message,
		})
	}
}
