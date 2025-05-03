import mongoose from 'mongoose'

const EditorGig_Schema = mongoose.Schema({
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

const Editor_Gig = mongoose.model('EditorGig', EditorGig_Schema)
export default Editor_Gig
