import express from 'express'
import { getOwnerProfile } from '../controllers/owner.controller.js'
import { createOwnerProfile, updateOwnerProfile } from '../controllers/profileSetting.controller.js'
import isAuthenticated from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js' // Multer middleware

const router = express.Router()

router.get('/owner/profile/:id', isAuthenticated, getOwnerProfile)
router.post('/owner/profile/setup/:id', isAuthenticated, upload.single('file'), createOwnerProfile)
router.put('/owner/profile/settings/:id', isAuthenticated, upload.single('file'), updateOwnerProfile)

export default router
