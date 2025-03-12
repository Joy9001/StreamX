import express from 'express'
import { getAllEditors, getAllOwners } from '../controllers/admin.controller.js'

const router = express.Router()

// Routes for admin
router.get('/owners', getAllOwners)
router.get('/editors', getAllEditors)

export default router
