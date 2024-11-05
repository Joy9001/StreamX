import express from 'express'
import { createUser } from '../controllers/UserController.js'
import isAuthenticated from '../middlewares/auth.middleware.js'
const router = express.Router()

router.post('/', isAuthenticated, createUser)
export default router
