import express from 'express'
import { Editor_gig_cont, getEditorGigByEmail, updateEditorGigByEmail } from '../controllers/editor_gig_controller.js'
import { Editor_gig_plans, getEditorGigPlansByEmail, updateEditorGigPlansByEmail } from '../controllers/editor_plan_controller.js'
import { EditorData } from '../controllers/EditorData.js'
import { EditorPlansData } from '../controllers/EditorPlans.js'

const router = express.Router()

router.post('/', Editor_gig_cont)
router.get('/', EditorData)
router.get('/plans', EditorPlansData)
router.post('/plan', Editor_gig_plans)
router.get('/email/:email', getEditorGigByEmail)
router.get('/plans/email/:email', getEditorGigPlansByEmail)
router.patch('/email/:email', updateEditorGigByEmail)
router.patch('/plans/email/:email', updateEditorGigPlansByEmail)

export default router
