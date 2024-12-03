import mongoose from 'mongoose'

const requestSchema = new mongoose.Schema(
	{
		to_id: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		video_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Video',
			required: true,
		},
		from_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Owner',
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
		status: {
			type: String,
			enum: ['pending', 'approved', 'rejected'],
			default: 'pending',
		},
	},
	{
		timestamps: true,
	}
)

const Request = mongoose.model('Request', requestSchema)

export default Request
