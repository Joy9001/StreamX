import { Schema, model } from 'mongoose'

const adminSchema = new Schema({
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

const Admin = model('Admin', adminSchema)

export default Admin
