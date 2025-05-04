import { model, Schema } from 'mongoose'

const editorGigPlans = Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	basic: {
		price: {
			type: Number,
			default: 0,
		},
		desc: {
			type: String,
			default: '-',
		},
		deliveryTime: {
			type: Number,
			default: 0,
		},
		services: {
			type: [String],
			default: ['-'],
		},
		ServiceOptions: {
			type: [Number],
		},
	},
	standard: {
		price: {
			type: Number,
			default: 0,
		},
		desc: {
			type: String,
			default: '-',
		},
		deliveryTime: {
			type: Number,
			default: 0,
		},
		services: {
			type: [String],
			default: ['-'],
		},
		ServiceOptions: {
			type: [Number],
		},
	},
	premium: {
		price: {
			type: Number,
			default: 0,
		},
		desc: {
			type: String,
			default: '-',
		},
		deliveryTime: {
			type: Number,
			default: 0,
		},
		services: {
			type: [String],
			default: ['-'],
		},
		ServiceOptions: {
			type: [Number],
		},
	},
})

const EditorGigPlans = model('EditorGigPlans', editorGigPlans)
export default EditorGigPlans
