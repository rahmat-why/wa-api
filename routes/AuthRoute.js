import { Router } from 'express'
import * as controller from './../controllers/AuthController.js'
import EmptyUserValidator from './../middlewares/EmptyUserValidator.js'

const router = Router()

router.get('/get-user', controller.getUser)
router.post('/register', controller.register)
router.post('/login', EmptyUserValidator, controller.login)
router.post('/verify-otp', EmptyUserValidator, controller.verifyOtp)

export default router
