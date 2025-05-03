import Wallet from '../models/wallet.model.js'
import Transaction from '../models/transaction.model.js'

// Create a new wallet
export const createWallet = async (req, res) => {
	try {
		const { userId, type } = req.body

		const wallet = new Wallet({
			userId,
			type,
			balance: 0,
		})

		await wallet.save()
		res.status(201).json(wallet)
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
}

// Get wallet by ID
export const getWallet = async (req, res) => {
	try {
		const wallet = await Wallet.findOne({ userId: req.params.id })
		if (!wallet) {
			return res.status(404).json({ message: 'Wallet not found' })
		}
		res.json(wallet)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

// Update wallet balance
export const updateBalance = async (req, res) => {
	try {
		const { amount, paymentMethod } = req.body
		const wallet = await Wallet.findOne({ userId: req.params.id })

		if (!wallet) {
			console.log('Wallet not found:', { userId: req.params.id })
			return res.status(404).json({ message: 'Wallet not found' })
		}

		console.log('Updating wallet balance:', {
			userId: wallet.userId,
			currentBalance: wallet.balance,
			amountToAdd: amount,
			paymentMethod: paymentMethod,
			method: req.method,
			endpoint: req.originalUrl,
		})

		// Start a session for atomic update
		const session = await Wallet.startSession()
		session.startTransaction()

		try {
			// Update balance
			wallet.balance += amount
			await wallet.save({ session })

			// Create transaction record
			const transaction = new Transaction({
				walletId: wallet.userId,
				amount: amount,
				type: 'deposit',
				status: 'completed',
				paymentMethod: paymentMethod,
			})
			await transaction.save({ session })

			// Commit the transaction
			await session.commitTransaction()

			console.log('Wallet balance updated:', {
				userId: wallet.userId,
				newBalance: wallet.balance,
				transactionId: transaction._id,
			})

			res.json({
				message: 'Balance updated successfully',
				wallet,
				newBalance: wallet.balance,
				transaction,
			})
		} catch (error) {
			// If any error occurs, rollback the transaction
			await session.abortTransaction()
			console.error('Transaction error:', error)
			throw error
		} finally {
			session.endSession()
		}
	} catch (error) {
		console.error('Error updating wallet balance:', error)
		res.status(400).json({ message: error.message })
	}
}

// Transfer money between wallets
export const transferMoney = async (req, res) => {
	try {
		const { fromWalletId, toWalletId, amount } = req.body

		console.log('Transfer money request:', {
			fromWalletId,
			toWalletId,
			amount,
		})

		// Find both wallets
		const fromWallet = await Wallet.findOne({ userId: fromWalletId })
		const toWallet = await Wallet.findOne({ userId: toWalletId })

		if (!fromWallet || !toWallet) {
			return res.status(404).json({ message: 'One or both wallets not found' })
		}

		// Check if sender has enough balance
		if (fromWallet.balance < amount) {
			return res.status(400).json({ message: 'Insufficient balance' })
		}

		// Start transaction
		const session = await Wallet.startSession()
		session.startTransaction()

		try {
			// Update balances
			fromWallet.balance -= amount
			toWallet.balance += amount

			// Save changes
			await fromWallet.save({ session })
			await toWallet.save({ session })

			// Commit transaction
			await session.commitTransaction()

			res.json({
				message: 'Transfer successful',
				fromWallet,
				toWallet,
			})
		} catch (error) {
			console.error('transferMoney', error)
			// If any error occurs, rollback the transaction
			await session.abortTransaction()
			throw error
		} finally {
			session.endSession()
		}
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
}

// Get all wallets (for admin purposes)
export const getAllWallets = async (req, res) => {
	try {
		const wallets = await Wallet.find()
		res.json(wallets)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

// Get wallet by type
export const getWalletsByType = async (req, res) => {
	try {
		const wallets = await Wallet.find({ type: req.params.type })
		res.json(wallets)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}
