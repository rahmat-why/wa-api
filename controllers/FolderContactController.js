import response from '../response.js'
import ContactClass from '../class/ContactClass.js'
import { Folder, Contact } from '../models/ApiModel.js'
import crypto from 'crypto'

export async function store(req, res) {

  const {name} = req.body
  const {id} = req.verified_token

  try {
    
    let folder_contact_id = crypto.randomBytes(5).toString('hex')
  
    while (await Folder.findOne({ where: { folder_contact_id } })) {
      folder_contact_id = crypto.randomBytes(5).toString('hex')
    }

    const contact = new ContactClass()
      .setFolderId(folder_contact_id)
      .setFolderName(name)
      .setFolderUserId(id)

    if (await contact.getFolder()) {
      return response(res, 422, false, "This folder already exist!")
    }
  
    await contact.storeFolder()

    return response(res, 200, true, "Folder created successfully!")

  } catch (err) {

    console.error(err)
    return response(res, 401, false, err.message, {})

  }

}

export async function getAll(req, res) {

  try {

    let Folders = await Folder.findAll({ where: { is_active: 1 } })

    if (Folders.length > 0) {

      return response(res, 200, true, "Folder contact found!",
        Folders.map(({folder_contact_id, name: title}) => {
          return { folder_contact_id, title }
        })
      )

    } else {

      return response(res, 422, true, "No folders were created yet!")

    }

  } catch (err) {

    console.error(err)
    return response(res, 401, false, err.message)

  }

}

export async function get(req, res) {

  try {

    const { folder_id } = req.params
  
    if (await Folder.findOne({where: { folder_contact_id: folder_id, is_active: 1 }})) {
  
      let contacts = await Contact.findAll({ where: {folder_contact_id: folder_id} })

      return response(res, 200, true, "Folder contact found!",
        contacts.map(({contact_id, name, telp}) => {
          return { contact_id, name, telp }
        })
      )

    } else {

      return response(res, 422, false, "Folder not found")

    }

  } catch(err) {

    console.error(err)
    return response(res, 401, false, err.message)

  }

}

export async function del(req, res) {

  try {

    const { folder_id } = req.params
    const folder = await Folder.findOne({ where: { folder_contact_id: folder_id, is_active: 1 } })

    if ( folder ) {

      if (await Contact.findOne({ where: { folder_contact_id: folder_id } })) {
  
        return response(res, 422, false, "This folder has no empty contact!")
  
      } else {

        await new ContactClass()
        .setFolderId(folder_id)
        .updateFolder(folder.name, 0, folder.user_id)

        return response(res, 200, true, "Folder deleted successfully!")
  
      }

    } else {

      return response(res, 422, false, "This folder not exist!")

    }

  } catch(err) {

    console.error(err)
    return response(res, 401, false, err.message)

  }

}