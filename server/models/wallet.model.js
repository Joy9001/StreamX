import { model, Schema } from 'mongoose'

const walletSchema = new Schema({
	userId: {
		type: String,
		required: true,
		unique: true,
	},
	type: {
		type: String,
		enum: ['Editor', 'Owner', 'Admin'],
		required: true,
	},
	balance: {
		type: Number,
		default: 1000,
		required: true,
	},
})

const Wallet = model('Wallet', walletSchema)

export default Wallet
