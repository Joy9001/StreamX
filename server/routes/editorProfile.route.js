import express from 'express'
import deleteEditorByEmail from '../controllers/deleteEditor.controller.js'
import { createEditorProfile, getEditorNameById, getHiredByOwners } from '../controllers/editorProfile.controller.js'
import updateEditor from '../controllers/editorProfileEdit.controller.js'
import { EditorData } from '../controllers/getEditor.controller.js'
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
