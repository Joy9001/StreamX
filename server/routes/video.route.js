import { Router } from 'express'
import {
	deleteController,
	downloadController,
	getAllController,
	recentController,
	uploadController,
} from '../controllers/video.controller.js'
import isAuthenticated from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'
const router = Router()

router.get('/all', isAuthenticated, getAllController)
router.get('/recent', isAuthenticated, recentController)
router.post('/upload', isAuthenticated, upload.single('file'), uploadController)
router.delete('/delete', isAuthenticated, deleteController)
router.post('/download/:id', isAuthenticated, downloadController)

export default router
