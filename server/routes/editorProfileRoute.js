import express from 'express';
import { createEditorProfile } from '../controllers/EditorProfileController.js';

const router = express.Router();

router.post('/', createEditorProfile);
export default router;