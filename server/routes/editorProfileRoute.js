import express from 'express';
import { createEditorProfile } from '../controllers/EditorProfileController.js';
import { EditorData } from '../controllers/GetEditor.js';
import GetEditorByEmail from '../controllers/GetEditorUsingMail.js';
import updateEditor from '../controllers/EditorProfileEdit.js';
const router = express.Router();

router.post('/', createEditorProfile);
router.get('/',EditorData);
router.get('/:email', GetEditorByEmail);
router.put('/:email', updateEditor);
export default router;