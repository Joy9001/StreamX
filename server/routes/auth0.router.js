import { Router } from 'express'
import { auth0CreateController } from '../controllers/auth0.controller.js'
const router = Router()

router.post('/create', auth0CreateController)

export default router
