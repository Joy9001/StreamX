import mongoose from 'mongoose'

const EditorGig_Schema = mongoose.Schema({
	name: String,
	email: {
		type: String,
		required: true,
		unique: true,
	},
	address: String,
	languages: {
		type: [String],
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	bio: {
		type: String,
		required: true,
	},
	skills: {
		type: [String],
		required: true,
	},
	gig_description: {
		type: String,
		required: false,
	},
	rating: Number,
})

const Editor_Gig = mongoose.model('EditorGig', EditorGig_Schema)
export default Editor_Gig
