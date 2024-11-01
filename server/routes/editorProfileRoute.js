import express from 'express'
import deleteEditorByEmail from '../controllers/DeleteEditor.js'
import { createEditorProfile } from '../controllers/EditorProfileController.js'
import updateEditor from '../controllers/EditorProfileEdit.js'
import { EditorData } from '../controllers/GetEditor.js'
import GetEditorByEmail from '../controllers/GetEditorUsingMail.js'
import isAuthenticated from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/', isAuthenticated, createEditorProfile)
router.get('/', isAuthenticated, EditorData)
router.get('/:email', isAuthenticated, GetEditorByEmail)
router.put('/:email', isAuthenticated, updateEditor)
router.delete('/:email', isAuthenticated, deleteEditorByEmail)
export default router
