import express from 'express'
import {
	createWallet,
	getWallet,
	updateBalance,
	getAllWallets,
	getWalletsByType,
	transferMoney,
} from '../controllers/wallet.controller.js'

const router = express.Router()

// Get all wallets (admin route)
router.get('/', getAllWallets)

// Get wallet by ID
router.get('/:id', getWallet)

// Create a new wallet
router.post('/', createWallet)

// Update wallet balance (PATCH)
router.patch('/:id/balance', updateBalance)

// Add money to wallet (POST)
router.post('/:id/deposit', updateBalance)

// Transfer money between wallets
router.post('/transfer', transferMoney)

// Get wallets by type
router.get('/type/:type', getWalletsByType)

export default router
