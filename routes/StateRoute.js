import { Router } from 'express'
import { createState, getState, updateState, deleteState, getAllState } from '../controllers/StateController.js'

const router = new Router()

router.get    ('/', getAllState)
router.put    ('/store', createState)
router.get    ('/:id', getState)
router.post   ('/:id/update', updateState)
router.delete ('/:id/delete', deleteState)

export default router