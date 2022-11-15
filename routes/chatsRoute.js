import { Router } from 'express'
import { body, query } from 'express-validator'
import multer from 'multer'
import requestValidator from './../middlewares/requestValidator.js'
import sessionValidator from './../middlewares/sessionValidator.js'
import * as controller from './../controllers/chatsController.js'
import getMessages from './../controllers/getMessages.js'

const router = Router()
const upload = multer({ dest: 'schedules/' })

router.get('/', query('id').notEmpty(), requestValidator, sessionValidator, controller.getList)

router.get('/show-schedule', controller.showSchedule)
router.get('/show-detail-schedule/:schedule_id', controller.showDetailSchedule)

router.post(
    '/send',
    body('receiver').notEmpty(),
    body('message').notEmpty(),
    requestValidator,
    sessionValidator,
    controller.send
)

router.post('/send-bulk', query('id').notEmpty(), requestValidator, sessionValidator, controller.sendBulk)
router.post('/store-schedule', upload.single('template'), controller.storeSchedule)

export default router
