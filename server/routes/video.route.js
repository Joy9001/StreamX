import { Router } from 'express'
import {
	deleteController,
	getAllController,
	recentController,
	storageUsageController,
	updateVideoOwnership,
	uploadController,
} from '../controllers/video.controller.js'
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

// Apply middleware to all routes
router.use(logRequest)

// Define routes
router.get('/all/:role/:userId', getAllController)
router.get('/recent/:role/:userId', recentController)
router.get('/storage-usages/:role/:userId', storageUsageController)

router.post('/upload', upload.single('file'), uploadController)

router.patch('/update-ownership', updateVideoOwnership)

router.delete('/delete', deleteController)

export default router
