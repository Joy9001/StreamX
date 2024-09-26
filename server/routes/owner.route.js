import express from 'express';
import { getOwnerProfile } from '../controllers/owner.controller.js';
import { updateOwnerProfile, createOwnerProfile } from "../controllers/profileSetting.controller.js"
import { upload } from '../middlewares/multer.middleware.js'; // Multer middleware

const router = express.Router();


router.get('/owner/profile/:id', getOwnerProfile);
router.post('/owner/profile/setup', upload.single('profilephoto'), createOwnerProfile);
router.put('/owner/profile/settings', upload.single('profilephoto'), updateOwnerProfile);

export default router;
