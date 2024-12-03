import mongoose from 'mongoose'

const ownerSchema = new mongoose.Schema({
	username: {
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
	ytChannelId: {
		type: String,
		default: '',
	},
	ytChannelname: {
		type: String,
		default: '',
	},
	ytChannelLink: {
		type: String,
		default: '',
	},
	profilephoto: {
		type: String,
		default: '',
	},
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
})

const Owner = mongoose.model('Owner', ownerSchema)
export default Owner
