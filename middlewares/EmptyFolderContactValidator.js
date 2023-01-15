import response from './../response.js'
import FolderContactClass from '../class/FolderContactClass.js'

export async function validate(req, res, next) {

  const { folder_id: folder_contact_id } = req.params

  try {

    let isFolderExist = await new FolderContactClass()
      .setFolderContactId(folder_contact_id)
      .isExistFolder()

    if (isFolderExist) next()
    else return response(res, 404, false, "Folder not found")

  } catch(err) {

    console.error(err)
    return response(res, 500, false, err.message, {})

  }

}

export default validate