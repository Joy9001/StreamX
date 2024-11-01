import express from 'express'
import { Editor_gig_cont } from '../controllers/editor_gig_controller.js'
import { Editor_gig_plans } from '../controllers/editor_plan_controller.js'
import { EditorData } from '../controllers/EditorData.js'
import { EditorPlansData } from '../controllers/EditorPlans.js'
import isAuthenticated from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/', isAuthenticated, Editor_gig_cont)

router.get('/', isAuthenticated, EditorData)

router.get('/plans', isAuthenticated, EditorPlansData)

router.post('/plan', isAuthenticated, Editor_gig_plans)
export default router
