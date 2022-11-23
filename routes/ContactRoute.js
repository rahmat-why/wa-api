import { Router } from 'express'
import * as folder from '../controllers/FolderContactController.js'
import validate from '../middlewares/EmptyFolderContactValidator.js'

const router = new Router()

router.post('/store-folder', folder.store)
router.get('/show-folder', folder.show)
router.get('/show-folder/:folder_id', validate, folder.get)
router.delete('/delete-folder/:folder_id', validate, folder.del)

export default router