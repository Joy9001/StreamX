import { model, Schema } from 'mongoose'

const videoSchema = new Schema(
	{
		ownerId: {
			type: Schema.Types.ObjectId,
			required: [true, 'Owner Id is required'],
			ref: 'User',
		},
		editorId: {
			type: Schema.Types.ObjectId,
			required: false,
			ref: 'Editor',
		},
		editorAccess: {
			type: Schema.Types.Boolean,
			required: false,
			default: false,
		},
		url: {
			type: Schema.Types.String,
			required: [true, 'Video URL is required'],
			default: '',
		},
		metaData: {
			type: Object,
			required: [true, 'Video Metadata is required'],
		},
		playListId: {
			type: Schema.Types.ObjectId,
			required: false,
		},
		ytData: {
			type: Object,
			required: false,
		},
		uploadStatus: {
			type: Schema.Types.String,
			enum: ['None', 'Uploading', 'Uploaded', 'Failed'],
			default: 'None',
		},
		scheduleUpload: {
			type: Schema.Types.Date,
			required: false,
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
