import { Router } from 'express'
import {
  storeFolderContact,
  showFolderContact,
  getFolderContact,
  deleteFolderContact
} from '../controllers/ContactController.js'
import validate from '../middlewares/FolderContactValidator.js'

const router = new Router()

router.post('/store-folder', storeFolderContact)
router.get('/show-folder',  showFolderContact)
router.get('/show-folder/:folder_id', validate, getFolderContact)
router.delete('/delete-folder/:folder_id', validate, deleteFolderContact)

export default router