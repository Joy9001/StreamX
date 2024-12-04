import express from 'express'
import {
	createOwner,
	deleteOwner,
	getAllOwners,
	getHiredEditors,
	getOwnerByEmail,
	getOwnerProfile,
	updateOwner,
	getOwnerNameById,
} from '../controllers/owner.controller.js'
import { createOwnerProfile, updateOwnerProfile } from '../controllers/profileSetting.controller.js'
import { upload } from '../middlewares/multer.middleware.js'

const router = express.Router()

// Admin dashboard routes
router.get('/ownerProfile', getAllOwners)
router.get('/ownerProfile/:email', getOwnerByEmail)
router.post('/ownerProfile', createOwner)
router.patch('/ownerProfile/:email', updateOwner)
router.delete('/ownerProfile/:email', deleteOwner)

// Original routes
router.get('/owner/profile/:id', getOwnerProfile)
router.post('/owner/profile/setup/:id', upload.single('file'), createOwnerProfile)
router.put('/owner/profile/settings/:id', upload.single('file'), updateOwnerProfile)

router.get('/hired-editors/:ownerId', getHiredEditors)
router.get('/owner/name/:id', getOwnerNameById)

export default router
