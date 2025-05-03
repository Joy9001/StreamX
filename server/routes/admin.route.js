import express from 'express'
import { getAllEditors, getAllOwners, getAllRequests, getAllVideos } from '../controllers/admin.controller.js'

const router = express.Router()

router.get('/owners', getAllOwners)
router.get('/editors', getAllEditors)
router.get('/requests', getAllRequests)
router.get('/videos', getAllVideos)

export default router
