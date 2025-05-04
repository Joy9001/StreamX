import express from 'express'
import { getAllEditors, getAllOwners } from '../controllers/admin.controller.js'

const router = express.Router()

/**
 * @swagger
 * /api/admin/owners:
 *   get:
 *     summary: Get all owners (admin access)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all owners
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Owner'
 *       401:
 *         description: Unauthorized - Admin access required
 *       500:
 *         description: Server error
 */
router.get('/owners', getAllOwners)

/**
 * @swagger
 * /api/admin/editors:
 *   get:
 *     summary: Get all editors (admin access)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all editors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Editor'
 *       401:
 *         description: Unauthorized - Admin access required
 *       500:
 *         description: Server error
 */
router.get('/editors', getAllEditors)

export default router
