import express from 'express'
import { getOwnerProfile } from '../controllers/owner.controller.js'
import { createOwnerProfile, updateOwnerProfile } from '../controllers/profileSetting.controller.js'
import { upload } from '../middlewares/multer.middleware.js' // Multer middleware

const router = express.Router()

router.get('/owner/profile/:id', getOwnerProfile)
router.post('/owner/profile/setup/:id', upload.single('file'), createOwnerProfile)
router.put('/owner/profile/settings/:id', upload.single('file'), updateOwnerProfile)

export default router
