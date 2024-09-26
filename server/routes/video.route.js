import { Router } from 'express'
import {
	deleteController,
	downloadController,
	getAllController,
	recentController,
	uploadController,
} from '../controllers/video.controller.js'
import { upload } from '../helpers/multer.helper.js'
const router = Router()

router.get('/all', getAllController)
router.get('/recent', recentController)
router.post('/upload', upload.single('file'), uploadController)
router.delete('/delete', deleteController)
router.post('/download/:id', downloadController)

export default router
