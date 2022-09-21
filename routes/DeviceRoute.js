import { Router } from 'express'
import * as controller from './../controllers/DeviceController.js'

const router = Router()

router.get('/show-device', controller.showDevice)
router.get('/get-device/:device_id', controller.getDevice)
router.post('/store-device', controller.storeDevice)
router.put('/update-device/:device_id', controller.updateDevice)
router.post('/call-webhook', controller.callWebhook)

export default router
