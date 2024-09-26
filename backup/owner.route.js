import express from 'express';
import { getOwnerProfile } from '../controllers/owner.controller.js';

const router = express.Router();

router.get('/profile', getOwnerProfile);

export default router;

