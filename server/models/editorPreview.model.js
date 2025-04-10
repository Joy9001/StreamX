import mongoose from 'mongoose'
const preview_schema = mongoose.Schema({
	editor_id: Number,
	videos: {
		video_id: Number,
		url: String,
		metadata: {
			filename: String,
			type: String,
			size: Number,
		},
	},
	images: {
		image_id: Number,
		url: String,
		metadata: {
			filename: String,
			type: String,
			size: Number,
		},
	},
})
const preview = mongoose.model('preview_schema', preview_schema)
export default preview
