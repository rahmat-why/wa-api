import { Router } from 'express'
import { createJourney, getJourney, updateJourney, deleteJourney, getAllJourney } from '../controllers/JourneyController.js'
import { journeyValidator, keyValidator } from '../middlewares/JourneyValidator.js'

const router = new Router()

router.get    ('/', getAllJourney)
router.put    ('/store', keyValidator, createJourney)
router.get    ('/:id', journeyValidator, getJourney)
router.post   ('/:id/update', journeyValidator, keyValidator, updateJourney)
router.delete ('/:id/delete', journeyValidator, keyValidator, deleteJourney)

export default router