import response from './../response.js'
import ContactClass from '../class/ContactClass.js'

export async function validate(req, res, next) {

  const { folder_id } = req.params

  try {

    if (await new ContactClass().setFolderId(folder_id).isExistFolder()) next()
    else return response(res, 404, false, "Folder not found")

  } catch(err) {

    console.error(err)
    return response(res, 401, false, err.message, {})

  }

}

export default validate