import mongoose from 'mongoose'

const editorSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
		},
		profilephoto: {
			type: String,
		},
		videoIds: [{ type: String }],
		storageLimit: {
			type: Number,
			default: 10 * 1024,
		},
		usedStorage: {
			type: Number,
			default: 0,
		},
		providerSub: {
			type: Array,
			required: true,
		},
		membership: {
			type: String,
			enum: ['bronze', 'silver', 'gold'],
			default: 'bronze',
		},
	},
	{ timestamps: true }
)

const Editor = mongoose.model('Editor', editorSchema)
export default Editor
