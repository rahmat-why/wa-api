import { Router } from 'express'
import AuthValidator from './middlewares/AuthValidator.js'
import DeviceValidator from './middlewares/DeviceValidator.js'
import sessionsRoute from './routes/sessionsRoute.js'
import chatsRoute from './routes/chatsRoute.js'
import groupsRoute from './routes/groupsRoute.js'
import AuthRoute from './routes/AuthRoute.js'
import DeviceRoute from './routes/DeviceRoute.js'
import OrderRoute from './routes/OrderRoute.js'
import response from './response.js'

const router = Router()

router.use('/sessions', DeviceValidator, sessionsRoute)
router.use('/chats', DeviceValidator, chatsRoute)
router.use('/groups', groupsRoute)
router.use('/auth', AuthRoute)
router.use('/device', AuthValidator, DeviceRoute)
router.use('/order', AuthValidator, OrderRoute)

router.all('*', (req, res) => {
    response(res, 404, false, 'The requested url cannot be found.')
})

export default router
