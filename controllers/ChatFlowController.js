import response from '../response.js'
import ChatFlowClass from '../class/ChatFlowClass.js'

export async function createChatFlow(req, res) {
  const { id: user_id } = req.verified_token
  let { id, name, description } = req.body
  try {
    const doc = await new ChatFlowClass()
      .setChatFlowId(id)
      .setUserId(user_id)
      .setName(name)
      .setDescription(description)
      .storeChatFlow()
    return response(res, 201, true, 'Successfully store chatflow', doc.toObject())
  } catch (err) {
    console.error(err)
    return response(res, 500, false, err.message, {})
  }
}

export async function getAllChatFlow(req, res) {
  const { id: user_id } = req.verified_token
  try {
    const doc = await new ChatFlowClass()
      .setUserId(user_id)
      .getAllChatFlow()
    return response(res, 200, true, 'Successfully retrieve all chatflow', doc.map(e => e.toObject()))
  } catch (err) {
    console.error(err)
    return response(res, 500, false, err.message, {})
  }
}

export async function getChatFlow(req, res) {
  let { id } = req.params
  try {
    const doc = await new ChatFlowClass()
      .setChatFlowId(id)
      .getChatFlow()
    return response(res, 200, true, 'Successfully retrieve chatflow', doc.toObject())
  } catch (err) {
    console.error(err)
    return response(res, 500, false, err.message, {})
  }
}

export async function updateChatFlow(req, res) {
  let { id } = req.params
  let { name, description } = req.body
  try {
    const doc = await new ChatFlowClass()
      .setChatFlowId(id)
      .updateChatFlow(name, description)
    return response(res, 200, true, 'Successfully update chatflow', doc.toObject())
  } catch (err) {
    console.error(err)
    return response(res, 500, false, err.message, {})
  }
}

export async function deleteChatFlow(req, res) {
  let { id } = req.params
  try {
    const doc = await new ChatFlowClass()
      .setChatFlowId(id)
      .deleteChatFlow()
    return response(res, 200, true, 'Successfully delete chatflow', doc.toObject())
  } catch (err) {
    console.error(err)
    return response(res, 500, false, err.message, {})
  }
}