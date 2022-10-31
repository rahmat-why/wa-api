import response from '../response.js'
import { FolderContact as db } from '../models/ApiModel.js'
import FolderContactClass from '../class/FolderContactClass.js'
import { FolderContact } from '../models/ApiModel.js'
import crypto from 'crypto'

export async function store(req, res) {

  const {name} = req.body
  let folder_contact_id = crypto.randomBytes(64).toString('hex')

  while (await db.findOne({ where: { folder_contact_id } })) {
    console.log('should be ran')
    folder_contact_id = crypto.randomBytes(64).toString('hex')
  }

  try {

    const contact = new FolderContactClass()
      .setFolderContactId(folder_contact_id)
      .setName(name)
      .setIsActive(1)
      .setUserId(req.verified_token.id)

    if (await contact.getFolderContact()) {
      return response(res, 422, false, "This folder already exist!")
    }
  
    await contact.storeFolderContact()

    return response(res, 200, true, "Folder created successfully!")

  } catch (err) {

    console.error(err)
    return response(res, 401, false, err.message, {})

  }

}

export async function get(req, res) {

  const { folder_contact_id } = req.params
  const { name, telp } = req.verified_token
  let contact

  try {
  
    if (folder_contact_id ?? false) {

      contact = await FolderContact.findOne({ where: {folder_contact_id} })

      if (contact) {
        return response(res, 200, true, "Folder contact found!", {
          contact_id: folder_contact_id,
          name,
          telp
        })
      } else {
        return response(res, 422, false, "Folder not found")
      }

    } else {

      contact = await FolderContact.findOne({ where: {name: req.body.name} })

      if (contact) {
        const {folder_contact_id, name: title} = contact
        return response(res, 200, true, "Folder contact found!", {
          folder_contact_id,
          title
        })
      } else {
        return response(res, 422, false, "Folder contact not found!")
      }

    }

  } catch (err) {

    console.error(err)
    return response(res, 401, false, err.message, {})

  }

}