import response from '../response.js'
import ContactClass from '../class/ContactClass.js'
import { Contact } from '../models/ApiModel.js'
import crypto from 'crypto'

export async function del(req, res) {

  try {

  } catch (err) {

    console.error(err)
    return response(res, 401, false, err.message)

  }

}