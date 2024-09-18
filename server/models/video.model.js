import { model, Schema } from 'mongoose'

const videoSchema = new Schema(
	{
		id: {
			type: Schema.Types.String,
		},
		ownerId: {
			type: Schema.Types.ObjectId,
			required: [true, 'Owner Id is required'],
			ref: 'User',
		},
		editorId: {
			type: Schema.Types.ObjectId,
			required: [true, 'Editor Id is required'],
			ref: 'Editor',
		},
		editorAccess: {
			type: Schema.Types.Boolean,
			default: false,
		},
		videoUrl: {
			type: Schema.Types.String,
			default: '',
		},
		playListId: {
			type: Schema.Types.ObjectId,
			required: [true, 'Playlist Id is required'],
		},
		ytData: {
			type: Object,
			required: false,
		},
		uploadStatus: {
			type: Schema.Types.String,
			enum: ['None', 'Uploading', 'Uploaded', 'Failed'],
			default: false,
		},
		scheduleUpload: {
			type: Schema.Types.Date,
			default: Date.now(),
		},
		ApprovalStatus: {
			type: Schema.Types.String,
			enum: ['None', 'Pending', 'Approved', 'Rejected'],
			default: 'None',
		},
	},
	{ timestamps: true }
)

const Video = model('Video', videoSchema)

export default Video
