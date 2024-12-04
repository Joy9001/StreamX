import { Router } from 'express'
import {
	deleteController,
	downloadController,
	getAllController,
	getVideoNameById,
	getVideosByEditorId,
	recentController,
	storageUsageController,
	updateEditor,
	updateOwner,
	uploadController,
} from '../controllers/video.controller.js'
import { getAllVideos } from '../controllers/getAllVideos.controller.js'
import { upload } from '../middlewares/multer.middleware.js'

const router = Router()

// Debug middleware
const logRequest = (req, res, next) => {
	console.log('Incoming request:', {
		method: req.method,
		path: req.path,
		params: req.params,
		body: req.body,
		headers: req.headers,
	})
	next()
}

// Route to get all videos for admin dashboard
router.get('/all-videos', getAllVideos)

router.get('/all/:role/:userId', getAllController)
router.get('/recent/:role/:userId', recentController)
router.get('/editor/:editorId', getVideosByEditorId)
router.post('/upload/:role/:userId', upload.single('file'), uploadController)
router.delete('/delete/:role', deleteController)
router.get('/download/:id', downloadController)
router.get('/name/:videoId', getVideoNameById)

// Update video editor (place this before owner route to prevent conflicts)
router.patch('/:videoId/editor', logRequest, updateEditor)

// Update video owner
router.patch('/:videoId/owner', updateOwner)

router.get('/storage-usages/:role/:userId', storageUsageController)

export default router
