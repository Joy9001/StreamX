import mongoose from 'mongoose'

const adminSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	profilephoto: {
		type: String,
	},
	role: {
		type: String,
		default: 'admin',
	},
	providerSub: {
		type: Array,
		required: true,
	},
})

const Admin = mongoose.model('Admin', adminSchema)

export default Admin
