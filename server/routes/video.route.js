import { Router } from 'express'
import {
	deleteController,
	downloadController,
	getAllController,
	uploadController,
} from '../controllers/video.controller.js'
const router = Router()

router.get('/all', getAllController)
router.post('/upload', uploadController)
router.delete('/delete/:id', deleteController)
router.post('/download/:id', downloadController)
