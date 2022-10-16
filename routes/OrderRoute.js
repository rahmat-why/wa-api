import { Router } from 'express'
import * as controller from './../controllers/OrderController.js'
import EmptyDeviceValidator from './../middlewares/EmptyDeviceValidator.js'
import EmptyOrderValidator from './../middlewares/EmptyOrderValidator.js'

const router = Router()

router.get('/get-product/:product_id', controller.getProduct)
router.get('/show-product', controller.showProduct)
router.get('/get-order/:order_id', EmptyOrderValidator, controller.getOrder)
router.post('/store-order', EmptyDeviceValidator, controller.storeOrder)
router.post('/accept-order', EmptyOrderValidator, controller.acceptOrder)
router.post('/rollback-accept-order', EmptyOrderValidator, controller.rollbackAcceptOrder)

export default router
