import { Router } from 'express'

import {
	createEditorProfile,
	deleteEditorByEmail,
	getEditorByEmail,
	getEditorNameById,
	getHiredByOwners,
	updateEditor,
} from '../controllers/editorProfile.controller.js'

const router = Router()

router.post('/', createEditorProfile)
router.get('/name/:editorId', getEditorNameById)
router.get('/:email', getEditorByEmail)
router.put('/:email', updateEditor)
router.delete('/:email', deleteEditorByEmail)

router.get('/hiredby/:editorId', getHiredByOwners)
export default router
