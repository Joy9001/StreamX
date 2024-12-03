import { Router } from 'express'
import { reqAdminController, uploadController } from '../controllers/yt.controller.js'
const router = Router()

router.post('/upload/:role/:userId/:id', uploadController)
router.post('/req-admin/:videoId', reqAdminController)

export default router
