import { Router } from 'express'
import * as controller from '../controllers/FolderContactController.js'

const router = new Router()

router.post('/store-folder', controller.store)
router.get('/show-folder', controller.get)
router.get('/show-folder/:folder_contact_id', controller.get)

export default router