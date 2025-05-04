import { model, Schema } from 'mongoose'

const transactionSchema = new Schema({
	walletId: {
		type: String,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	type: {
		type: String,
		enum: ['deposit', 'withdrawal', 'transfer'],
		required: true,
	},
	status: {
		type: String,
		enum: ['pending', 'completed', 'failed'],
		default: 'pending',
	},
	paymentMethod: {
		type: String,
		enum: ['Credit Card', 'PayPal', 'Bank Transfer'],
		required: true,
	},
	requestId: {
		type: String,
		required: false,
	},
	fromWalletId: {
		type: String,
		required: false,
	},
	toWalletId: {
		type: String,
		required: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

const Transaction = model('Transaction', transactionSchema)

export default Transaction
