import { Router } from 'express'
import * as controller from './../controllers/DeviceController.js'
import EmptyDeviceValidator from './../middlewares/EmptyDeviceValidator.js'

const router = Router()

router.get('/show-device', controller.showDevice)
router.get('/get-device/:device_id', EmptyDeviceValidator, controller.getDevice)
router.post('/store-device', controller.storeDevice)
router.put('/update-device/:device_id', EmptyDeviceValidator, controller.updateDevice)
router.post('/call-webhook', controller.callWebhook)

export default router
