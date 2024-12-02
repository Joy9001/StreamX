import express from 'express'
import { getOwnerProfile, getAllOwners, createOwner, deleteOwner } from '../controllers/owner.controller.js'
import { createOwnerProfile, updateOwnerProfile } from '../controllers/profileSetting.controller.js'
import { upload } from '../middlewares/multer.middleware.js' // Multer middleware

const router = express.Router()

// Admin dashboard routes
router.get('/ownerProfile', getAllOwners)
router.post('/ownerProfile', createOwner)
router.delete('/ownerProfile/:email', deleteOwner)

// Original routes
router.get('/ownerProfile/:id', getOwnerProfile)
router.post('/owner/profile/setup/:id', upload.single('file'), createOwnerProfile)
router.put('/owner/profile/settings/:id', upload.single('file'), updateOwnerProfile)

export default router
