import { model, Schema } from 'mongoose'

const editorGigSchema = new Schema({
	name: {
		type: String,
		default: '-',
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	address: {
		type: String,
		default: '-',
	},
	languages: {
		type: [String],
		default: ['-'],
	},
	image: {
		type: String,
		default: null,
	},
	bio: {
		type: String,
		default: '-',
	},
	skills: {
		type: [String],
		default: ['-'],
	},
	gig_description: {
		type: String,
		default: '-',
	},
	rating: {
		type: Number,
		default: 0,
	},
})

const EditorGig = model('EditorGig', editorGigSchema)
export default EditorGig
