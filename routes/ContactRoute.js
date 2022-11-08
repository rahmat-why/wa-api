import { Router } from 'express'
import * as folder from '../controllers/FolderContactController.js'
import * as contact from '../controllers/ContactController.js'

const router = new Router()

router.post('/store-folder', folder.store)
router.get('/show-folder', folder.getAll)
router.get('/show-folder/:folder_id', folder.get)
router.put('/delete-folder/:folder_id', folder.del)
// router.put('/delete-contact/:contact_id', contact.del)

export default router