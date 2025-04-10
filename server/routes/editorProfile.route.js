import express from 'express'
import deleteEditorByEmail from '../controllers/DeleteEditor.js'
import { createEditorProfile, getEditorNameById, getHiredByOwners } from '../controllers/EditorProfileController.js'
import updateEditor from '../controllers/EditorProfileEdit.js'
import { EditorData } from '../controllers/GetEditor.js'
import GetEditorByEmail from '../controllers/GetEditorUsingMail.js'

const router = express.Router()

router.post('/', createEditorProfile)
router.get('/', EditorData)
router.get('/name/:editorId', getEditorNameById)
router.get('/:email', GetEditorByEmail)
router.put('/:email', updateEditor)
router.delete('/:email', deleteEditorByEmail)

router.get('/hiredby/:editorId', getHiredByOwners)
export default router
