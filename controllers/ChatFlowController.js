import response from '../response.js'
import ChatFlowClass from '../class/ChatFlowClass.js'
import { ChatFlows } from '../models/MongoDBModel.js'

export async function createChatFlow(req, res) {
  let { id, name, description } = req.body
  try {
    const doc = await new ChatFlowClass()
      .setChatFlowId(id)
      .setName(name)
      .setDescription(description)
      .storeChatFlow()
    return response(res, 200, true, 'Successfully store chatflow', doc.toObject())
  } catch (err) {
    console.error(err)
    return response(res, 401, false, 'Error occured while storing chatflow', { code: err.code, message: err.message })
  }
}

export async function getAllChatFlow(req, res) {
  try {
    const doc = await ChatFlows.find().exec()
    return response(res, 200, true, 'Successfully store chatflow', doc.map(e => e.toObject) )
  } catch (err) {
    console.error(err)
    return response(res, 401, false, 'Error occured while retrieving chatflow', { code: err.code, message: err.message })
  }
}

export async function getChatFlow(req, res) {
  let { id } = req.params
  try {
    const doc = await new ChatFlowClass()
      .setChatFlowId(id)
      .getChatFlow()
    return response(res, 200, true, 'Successfully store chatflow', doc.toObject())
  } catch (err) {
    console.error(err)
    return response(res, 401, false, 'Error occured while retrieving chatflow', { code: err.code, message: err.message })
  }
}

export async function updateChatFlow(req, res) {
  let { id } = req.params
  let { name, description } = req.body
  try {
    const doc = await new ChatFlowClass()
      .setChatFlowId(id)
      .updateChatFlow(name, description)
    return response(res, 200, true, 'Successfully store chatflow', doc.toObject())
  } catch (err) {
    console.error(err)
    return response(res, 401, false, 'Error occured while updating chatflow', { code: err.code, message: err.message })
  }
}

export async function deleteChatFlow(req, res) {
  let { id } = req.params
  try {
    const doc = await new ChatFlowClass()
      .setChatFlowId(id)
      .deleteChatFlow()
    return response(res, 200, true, 'Successfully store chatflow', doc.toObject())
  } catch (err) {
    console.error(err)
    return response(res, 401, false, 'Error occured while deleting chatflow', { code: err.code, message: err.message })
  }
}