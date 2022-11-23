import { Router } from 'express'
import * as contact from '../controllers/ContactController.js'
import validate from '../middlewares/EmptyFolderContactValidator.js'

const router = new Router()

router.post('/store-folder', contact.storeFolder)
router.get('/show-folder', contact.showFolder)
router.get('/show-folder/:folder_id', validate, contact.getFolder)
router.delete('/delete-folder/:folder_id', validate, contact.deleteFolder)

export default router