import { model, Schema } from 'mongoose'

const gTokenSchema = new Schema({
	accessToken: {
		type: String,
		default: '',
	},
	refreshToken: {
		type: String,
		default: '',
	},
})

const ownerSchema = new Schema({
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
	gTokens: gTokenSchema,
	usedStorage: {
		type: Number,
		default: 0,
	},
	providerSub: {
		type: Array,
		required: true,
	},
	membership: {
		type: String,
		enum: ['bronze', 'silver', 'gold'],
		default: 'bronze',
	},
	bio: {
		type: String,
		default: '',
	},
})

const Owner = model('Owner', ownerSchema)
export default Owner
