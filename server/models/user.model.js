import { model, Schema } from 'mongoose'

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ['superuser', 'admin', 'testuser'],
		},
		Id: {
			type: String,
			required: true,
		},
		permissions: {
			owner: {
				edit: { type: Boolean, default: false },
				delete: { type: Boolean, default: false },
			},
			editor: {
				edit: { type: Boolean, default: false },
				delete: { type: Boolean, default: false },
			},
			editorGig: {
				edit: { type: Boolean, default: false },
				delete: { type: Boolean, default: false },
			},
			video: {
				delete: { type: Boolean, default: false },
			},
		},
	},
	{
		timestamps: true,
	}
)

const User = model('User', userSchema)

export default User
