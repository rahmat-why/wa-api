import { Contact, Folder } from '../models/ApiModel.js'

const contact_class = class ContactClass {
  constructor() {
    this.contact_id = null
    this.folder_id = null
    this.folder_name = null
    this.folder_user_id = null
    this.is_folder_active = null
    this.name = null
    this.telp = null
    this.profile_picture = null
  }

  setContactId(contact_id) {
    this.contact_id = contact_id
    return this
  }

  setFolderId(id) {
    this.folder_id = id
    return this
  }

  setFolderName(name) {
    this.folder_name = name
    return this
  }

  setFolderUserId(id) {
    this.folder_user_id = id
    return this
  }

  toggleFolder(bool) {
    this.is_folder_active = Boolean(num)
    return this
  }

  setName(name) {
    this.name = name
    return this
  }

  setTelp(no) {
    this.telp = no
    return this
  }

  setProfilePicture(img) {
    this.profile_picture = img
    return this
  }

  /* async getContact() {
    const contact = await Contact.findOne({
      where: { name: this.name }
    })

    return contact
  }

  async storeContact() {
    await Contact.create({
      contact_id: this.contact_id,
      folder_contact_id: this.folder_contact_id,
      name: this.name,
      telp: this.telp,
      profile_picture: this.profile_picture
    })

    return true
  } */

  async getFolder() {
    const folder = await Folder.findOne({
      where: { name: this.folder_name }
    })

    return folder
  }

  async storeFolder() {
    await Folder.create({
      folder_contact_id: this.folder_id,
      name: this.folder_name,
      is_active: 1,
      user_id: this.folder_user_id
    })

    return true
  }

  async updateFolder(name, is_active, user_id) {
    return (
      await Folder
      .update(
        { name, is_active, user_id },
        { where: { folder_contact_id: this.folder_id } }
      )
    )[1]
  }

}

export default contact_class
