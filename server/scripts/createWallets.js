import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Admin from '../models/admin.model.js'
import Editor from '../models/editor.model.js'
import Owner from '../models/owner.model.js'
import Wallet from '../models/wallet.model.js'

dotenv.config()

mongoose
	.connect(process.env.MONGO_DB_URI)
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => {
		console.error('MongoDB connection error:', err)
		process.exit(1)
	})

async function createWallets() {
	console.log('Starting wallet creation process...')

	try {
		const existingWallets = await Wallet.find({})
		const existingUserIds = new Set(existingWallets.map((wallet) => wallet.userId))

		console.log(`Found ${existingWallets.length} existing wallets`)

		const owners = await Owner.find({})
		console.log(`Processing ${owners.length} owners...`)

		const ownerWallets = owners
			.filter((owner) => !existingUserIds.has(owner._id.toString()))
			.map((owner) => ({
				userId: owner._id.toString(),
				type: 'Owner',
				balance: 1000,
			}))

		const editors = await Editor.find({})
		console.log(`Processing ${editors.length} editors...`)

		const editorWallets = editors
			.filter((editor) => !existingUserIds.has(editor._id.toString()))
			.map((editor) => ({
				userId: editor._id.toString(),
				type: 'Editor',
				balance: 1000,
			}))

		const admins = await Admin.find({})
		console.log(`Processing ${admins.length} admins...`)

		const adminWallets = admins
			.filter((admin) => !existingUserIds.has(admin._id.toString()))
			.map((admin) => ({
				userId: admin._id.toString(),
				type: 'Admin',
				balance: 1000,
			}))

		const newWallets = [...ownerWallets, ...editorWallets, ...adminWallets]

		if (newWallets.length > 0) {
			await Wallet.insertMany(newWallets)
			console.log(`Successfully created ${newWallets.length} new wallets!`)
		} else {
			console.log('No new wallets needed to be created.')
		}

		console.log('\nWallet Creation Summary:')
		console.log(`- Owner wallets created: ${ownerWallets.length}`)
		console.log(`- Editor wallets created: ${editorWallets.length}`)
		console.log(`- Admin wallets created: ${adminWallets.length}`)
		console.log(`- Total wallets created: ${newWallets.length}`)
		console.log(`- Existing wallets: ${existingWallets.length}`)
		console.log(`- Total wallets now: ${existingWallets.length + newWallets.length}`)
	} catch (error) {
		console.error('Error during wallet creation:', error)
	} finally {
		mongoose.connection.close()
		console.log('Database connection closed')
	}
}

createWallets()
