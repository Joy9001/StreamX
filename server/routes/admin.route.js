import express from 'express'
import { getAllEditors, getAllOwners, getAllRequests } from '../controllers/admin.controller.js'

const router = express.Router()

router.get('/owners', getAllOwners)
router.get('/editors', getAllEditors)
router.get('/requests', getAllRequests)

export default router
