import { Router } from 'express'
import { uploadController } from '../controllers/yt.controller.js'
import isAuthenticated from '../middlewares/auth.middleware.js'
const router = Router()

router.post('/upload', isAuthenticated, uploadController)

export default router
