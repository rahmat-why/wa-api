import { Router } from 'express'
import * as controller from './../controllers/AuthController.js'

const router = Router()

router.get('/get-user', controller.getUser)
router.post('/register', controller.register)
router.post('/login', controller.login)
router.post('/verify-otp', controller.verifyOtp)

export default router
