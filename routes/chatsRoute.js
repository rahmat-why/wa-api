import { Router } from 'express'
import { body, query } from 'express-validator'
import requestValidator from './../middlewares/requestValidator.js'
import sessionValidator from './../middlewares/sessionValidator.js'
import * as controller from './../controllers/chatsController.js'
import getMessages from './../controllers/getMessages.js'

const router = Router()

router.get('/', query('id').notEmpty(), requestValidator, sessionValidator, controller.getList)

router.get('/:jid', query('id').notEmpty(), requestValidator, sessionValidator, getMessages)

router.post(
    '/send',
    body('receiver').notEmpty(),
    body('message').notEmpty(),
    requestValidator,
    sessionValidator,
    controller.send
)

router.post(
    '/send-bulk', 
    requestValidator, 
    sessionValidator, 
    controller.sendBulk
)

router.post('/check-number', body('receiver').notEmpty(), requestValidator, sessionValidator, controller.checkNumber)

router.post('/formatted-response', controller.formattedResponse)

export default router
