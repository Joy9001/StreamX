import { Router } from 'express'
import {
	createEditorGig,
	getEditorGigByEmail,
	getEditorGigData,
	updateEditorGigByEmail,
} from '../controllers/editorGig.controller.js'
import {
	getEditorGigPlans,
	getEditorGigPlansByEmail,
	updateEditorGigPlans,
	updateEditorGigPlansByEmail,
} from '../controllers/editorPlan.controller.js'

const router = Router()

router.post('/', createEditorGig)
router.get('/', getEditorGigData)
router.get('/plans', getEditorGigPlans)
router.post('/plan', updateEditorGigPlans)
router.get('/email/:email', getEditorGigByEmail)
router.get('/plans/email/:email', getEditorGigPlansByEmail)
router.patch('/email/:email', updateEditorGigByEmail)
router.patch('/plans/email/:email', updateEditorGigPlansByEmail)

export default router
