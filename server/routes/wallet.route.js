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

/**
 * @swagger
 * components:
 *   schemas:
 *     Wallet:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the wallet
 *         userId:
 *           type: string
 *           description: ID of the user who owns this wallet
 *         balance:
 *           type: number
 *           description: Current wallet balance
 *         type:
 *           type: string
 *           enum: [owner, editor, admin]
 *           description: Type of the wallet
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the wallet was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the wallet was last updated
 */

/**
 * @swagger
 * /api/wallet:
 *   get:
 *     summary: Get all wallets (admin access)
 *     tags: [Wallets]
 *     responses:
 *       200:
 *         description: List of all wallets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Wallet'
 *       500:
 *         description: Server error
 */
router.get('/', getAllWallets)

/**
 * @swagger
 * /api/wallet/{id}:
 *   get:
 *     summary: Get wallet by ID
 *     tags: [Wallets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallet ID
 *     responses:
 *       200:
 *         description: Wallet details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wallet'
 *       404:
 *         description: Wallet not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getWallet)

/**
 * @swagger
 * /api/wallet:
 *   post:
 *     summary: Create a new wallet
 *     tags: [Wallets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID for whom wallet is being created
 *               type:
 *                 type: string
 *                 enum: [owner, editor, admin]
 *                 description: Type of wallet
 *               initialBalance:
 *                 type: number
 *                 description: Initial wallet balance
 *             required:
 *               - userId
 *               - type
 *     responses:
 *       201:
 *         description: Wallet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wallet'
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
router.post('/', createWallet)

/**
 * @swagger
 * /api/wallet/{id}/balance:
 *   patch:
 *     summary: Update wallet balance
 *     tags: [Wallets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallet ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount to add or subtract (use negative for withdrawal)
 *             required:
 *               - amount
 *     responses:
 *       200:
 *         description: Wallet balance updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wallet'
 *       400:
 *         description: Invalid request or insufficient funds
 *       404:
 *         description: Wallet not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/balance', updateBalance)

/**
 * @swagger
 * /api/wallet/{id}/deposit:
 *   post:
 *     summary: Add money to wallet
 *     tags: [Wallets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallet ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount to deposit
 *             required:
 *               - amount
 *     responses:
 *       200:
 *         description: Money added to wallet
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wallet'
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Wallet not found
 *       500:
 *         description: Server error
 */
router.post('/:id/deposit', updateBalance)

/**
 * @swagger
 * /api/wallet/transfer:
 *   post:
 *     summary: Transfer money between wallets
 *     tags: [Wallets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sourceWalletId:
 *                 type: string
 *                 description: Source wallet ID
 *               destinationWalletId:
 *                 type: string
 *                 description: Destination wallet ID
 *               amount:
 *                 type: number
 *                 description: Amount to transfer
 *             required:
 *               - sourceWalletId
 *               - destinationWalletId
 *               - amount
 *     responses:
 *       200:
 *         description: Money transferred successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sourceWallet:
 *                   $ref: '#/components/schemas/Wallet'
 *                 destinationWallet:
 *                   $ref: '#/components/schemas/Wallet'
 *                 amount:
 *                   type: number
 *       400:
 *         description: Invalid request or insufficient funds
 *       404:
 *         description: One or both wallets not found
 *       500:
 *         description: Server error
 */
router.post('/transfer', transferMoney)

/**
 * @swagger
 * /api/wallet/type/{type}:
 *   get:
 *     summary: Get wallets by type
 *     tags: [Wallets]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [owner, editor, admin]
 *         description: Type of wallets to retrieve
 *     responses:
 *       200:
 *         description: List of wallets by type
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Wallet'
 *       500:
 *         description: Server error
 */
router.get('/type/:type', getWalletsByType)

export default router
