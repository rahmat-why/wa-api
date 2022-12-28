import { Router } from 'express'
import { createJourney, getJourney, updateJourney, deleteJourney, getAllJourney } from '../controllers/JourneyController.js'

const router = new Router()

router.get    ('/', getAllJourney)
router.put    ('/store', createJourney)
router.get    ('/:id', getJourney)
router.post   ('/:id/update', updateJourney)
router.delete ('/:id/delete', deleteJourney)

export default router