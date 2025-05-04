import { model, Schema } from 'mongoose'

const tokenSchema = new Schema({
	userId: {
		type: String,
		required: true,
	},
	accesstoken: {
		type: String,
		required: true,
	},
	refreshToken: {
		type: String,
	},
})

const Token = model('Token', tokenSchema)
export default Token
