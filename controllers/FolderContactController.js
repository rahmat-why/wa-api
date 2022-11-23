import response from '../response.js'
import ContactClass from '../class/ContactClass.js'
import { Folder, Contact } from '../models/ApiModel.js'

export async function store(req, res) {

  const {name} = req.body
  const {id} = req.verified_token

  try {

    const contact = new ContactClass()
      .setFolderName(name)

    if (await contact.isUsedFolderName())
      return response(res, 422, false, "This folder already exist!")
  
    await contact
      .setFolderUserId(id)
      .storeFolder()
    return response(res, 200, true, "Folder created successfully!")

  } catch (err) {

    console.error(err)
    return response(res, 401, false, err.message, {})

  }

}

export async function show(req, res) {

  try {

    let Folders = await Folder.findAll({
      where: {
        user_id: req.verified_token.id,
        is_active: 1
      }
    })

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
  
    let contacts = await Contact.findAll({ where: {folder_contact_id: folder_id} })

    return response(res, 200, true, "Folder contact found!",
      contacts.map(({contact_id, name, telp}) => {
        return { contact_id, name, telp }
      })
    )

  } catch(err) {

    console.error(err)
    return response(res, 401, false, err.message)

  }

}

export async function del(req, res) {

  try {

    const { folder_id } = req.params
    const {name, user_id} = await Folder.findOne({ where: { folder_contact_id: folder_id, is_active: 1 } })

      if (await Contact.findOne({ where: { folder_contact_id: folder_id } })) {
  
        return response(res, 422, false, "This folder has no empty contact!")
  
      } else {

        await new ContactClass()
          .setFolderId(folder_id)
          .updateFolder(name, 0, user_id)

        return response(res, 200, true, "Folder deleted successfully!")
  
      }

  } catch(err) {

    console.error(err)
    return response(res, 401, false, err.message)

  }

}