import { Router } from 'express'
import { createChatFlow, getAllChatFlow, getChatFlow, updateChatFlow, deleteChatFlow } from '../controllers/ChatFlowController.js'

const router = new Router()

router.get    ('/', getAllChatFlow)
router.put    ('/store', createChatFlow)
router.get    ('/:id', getChatFlow)
router.post   ('/:id/update', updateChatFlow)
router.delete ('/:id/delete', deleteChatFlow)

export default router