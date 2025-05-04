import { model, Schema } from 'mongoose'

const messageSchema = new Schema(
	{
		sender_id: {
			type: Schema.Types.ObjectId,
			required: true,
		},
		sender_role: {
			type: String,
			enum: ['Owner', 'Editor'],
			required: true,
		},
		sender_name: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		timestamp: {
			type: Date,
			default: Date.now,
		},
	},
	{ _id: true }
)

const requestSchema = new Schema(
	{
		to_id: {
			type: Schema.Types.ObjectId,
			required: true,
		},
		video_id: {
			type: Schema.Types.ObjectId,
			ref: 'Video',
			required: true,
		},
		from_id: {
			type: Schema.Types.ObjectId,
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
		messages: [messageSchema],
	},
	{
		timestamps: true,
	}
)

const Request = model('Request', requestSchema)

export default Request
