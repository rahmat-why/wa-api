import { Router } from 'express'
import { createChatFlow, getAllChatFlow, getChatFlow, updateChatFlow, deleteChatFlow } from '../controllers/ChatFlowController.js'
import { chatflowValidator } from '../middlewares/ChatFlowValidator.js'

const router = new Router()

router.get    ('/', getAllChatFlow)
router.put    ('/store', createChatFlow)
router.get    ('/:id', chatflowValidator,getChatFlow)
router.post   ('/:id/update', chatflowValidator, updateChatFlow)
router.delete ('/:id/delete', chatflowValidator, deleteChatFlow)

export default router