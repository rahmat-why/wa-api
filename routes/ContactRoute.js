import { Router } from 'express'
import {
  storeFolderContact,
  showFolderContact,
  deleteFolderContact,
  showContact
} from '../controllers/ContactController.js'
import validate from '../middlewares/FolderContactValidator.js'

const router = new Router()

router.post('/store-folder', storeFolderContact)
router.get('/show-folder',  showFolderContact)
router.delete('/delete-folder/:folder_id', validate, deleteFolderContact)

router.get('/show-contact/:folder_id', validate, showContact)

export default router