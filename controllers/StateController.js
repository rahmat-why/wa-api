import response from '../response.js'
import StateClass from '../class/StateClass.js'

export async function createState(req, res) {
  const { id: user_id } = req.verified_token
  let { id, name, message } = req.body
  try {
    const doc = await new StateClass()
      .setStateId(id)
      .setUserId(user_id)
      .setName(name)
      .setMessage(message)
      .storeState()
    return response(res, 201, true, 'Successfully store state', doc.toObject())
  } catch (err) {
    console.error(err)
    return response(res, 500, false, err.message, {})
  }
}

export async function getAllState(req, res) {
  const { id: user_id } = req.verified_token
  try {
    const doc = await new StateClass()
      .setUserId(user_id)
      .getAllState()
    return response(res, 200, true, 'Successfully retrieve all state', doc.map(e => e.toObject()))
  } catch (err) {
    console.error(err)
    return response(res, 500, false, err.message, {})
  }
}

export async function getState(req, res) {
  let { id } = req.params
  try {
    const doc = await new StateClass()
      .setStateId(id)
      .getState()
    return response(res, 200, true, 'Successfully retrieve state', doc.toObject())
  } catch (err) {
    console.error(err)
    return response(res, 500, false, err.message, {})
  }
}

export async function updateState(req, res) {
  let { id } = req.params
  let { name, message } = req.body
  try {
    const doc = await new StateClass()
      .setStateId(id)
      .updateState(name, message)
    return response(res, 200, true, 'Successfully update state', doc.toObject())
  } catch (err) {
    console.error(err)
    return response(res, 500, false, err.message, {})
  }
}

export async function deleteState(req, res) {
  let { id } = req.params
  try {
    const doc = await new StateClass()
      .setStateId(id)
      .deleteState()
    return response(res, 200, true, 'Successfully delete state', doc.toObject())
  } catch (err) {
    console.error(err)
    return response(res, 500, false, err.message, {})
  }
}