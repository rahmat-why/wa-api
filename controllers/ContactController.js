import response from '../response.js'
import FolderContactClass from '../class/FolderContactClass.js'
import ContactClass from '../class/ContactClass.js'

export async function storeFolderContact(req, res) {

  let { name } = req.body
  let { id: user_id } = req.verified_token

  try {

    let folder = new FolderContactClass()
      .setUserId(user_id)
      .setName(name)

    if (await folder.isUsedFolderName())
      return response(res, 409, false, "This folder already exist!")

    await folder.storeFolder()
    return response(res, 201, true, "Folder created successfully!")

  } catch (err) {

    console.error(err)
    return response(res, 500, false, err.message, {})

  }

}

export async function showFolderContact(req, res) {
  
  let { id: user_id } = req.verified_token

  try {

    let folders = await new FolderContactClass()
      .setUserId(user_id)
      .getAllFolder()

      console.log(user_id)
    console.log(folders)

    if (folders.length === 0) return response(res, 404, true, "No folders were created yet!")

    let data = folders.map(({ folder_contact_id, name: title }) =>  ({ folder_contact_id, title }))
    return response(res, 200, true, "Folder contact found!", data)

  } catch (err) {

    console.error(err)
    return response(res, 500, false, err.message)

  }

}

export async function showContact(req, res) {

  let { folder_id: folder_contact_id } = req.params

  try {

    let data = (await new ContactClass()
      .setFolderContactId(folder_contact_id)
      .getContactWithinFolder())
      .map(({ contact_id, name, telp }) => ({ contact_id, name, telp }))
      
    return response(res, 200, true, "Folder contact found!", data)

  } catch (err) {

    console.error(err)
    return response(res, 500, false, err.message)

  }

}

export async function deleteFolderContact(req, res) {

  let { folder_id: folder_contact_id } = req.params

  try {

    let contacts = await new ContactClass()
      .setFolderContactId(folder_contact_id)
      .getContactWithinFolder()

    if (contacts.length > 0)
      return response(res, 422, false, "This folder has no empty contact!")

    await new FolderContactClass()
      .setFolderContactId(folder_contact_id)
      .softDeleteFolder()

    return response(res, 200, true, "Folder deleted successfully!")

  } catch (err) {

    console.error(err)
    return response(res, 500, false, err.message)

  }

}