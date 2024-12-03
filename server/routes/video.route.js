import { Router } from 'express'
import {
	deleteController,
	downloadController,
	getAllController,
	getVideoNameById,
	recentController,
	updateOwner,
	uploadController,
} from '../controllers/video.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
const router = Router()

router.get('/all/:role/:userId', getAllController)
router.get('/recent/:role/:userId', recentController)
router.post('/upload/:role/:userId', upload.single('file'), uploadController)
router.delete('/delete', deleteController)
router.get('/download/:id', downloadController)
router.get('/name/:videoId', getVideoNameById)

// Update video owner
router.patch('/:videoId/owner', updateOwner)

// Update video routes to include owner update endpoint
router.put('/:videoId/owner', updateOwner)

export default router
