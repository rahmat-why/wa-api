import {
  FolderContact
} from './../models/ApiModel.js'

const folder_contact_class = class FolderContactClass {
  constructor() {
    this.folder_contact_id = null
    this.name = null
    this.is_active = null
    this.user_id = null
  }

  setFolderContactId(folder_contact_id) {
    this.folder_contact_id = folder_contact_id
    return this
  }

  setName(name) {
    this.name = name
    return this
  }

  setIsActive(is_active) {
    this.is_active = is_active
    return this
  }

  setUserId(user_id) {
    this.user_id = user_id
    return this
  }

  async getFolderContact() {
    const contact = await FolderContact.findOne({
      where: {
        name: this.name
      }
    })

    return contact
  }

  async storeFolderContact() {
    await FolderContact.create({
      folder_contact_id: this.folder_contact_id,
      name: this.name,
      is_active: this.is_active,
      user_id: this.user_id
    })

    return true
  }

}

export default folder_contact_class
