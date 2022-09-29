import { Router } from 'express'
import * as controller from './../controllers/OrdersController.js'

const router = Router()

router.get('/show-product', controller.showProduct)
router.get('/get-order/:order_id', controller.getOrder)
router.post('/store-order', controller.storeOrder)
router.post('/accept-order', controller.acceptOrder)
router.post('/cancel-order', controller.cancelOrder)

export default router
