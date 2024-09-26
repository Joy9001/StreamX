import { Router } from 'express'
import { uploadController } from '../controllers/yt.controller.js'

const router = Router()

router.post('/upload', uploadController)

export default router
