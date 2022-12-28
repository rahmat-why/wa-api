import response from '../response.js'
import StateClass from '../class/StateClass.js'
import { States } from '../models/MongoDBModel.js'

export async function createState(req, res) {
  let { id, name, message } = req.body
  try {
    const doc = await new StateClass()
      .setStateId(id)
      .setName(name)
      .setMessage(message)
      .storeState()
    return response(res, 200, true, 'Successfully store state', doc.toObject())
  } catch (err) {
    console.error(err)
    return response(res, 401, false, 'Error occured while storing state', { code: err.code, message: err.message })
  }
}

export async function getAllState(req, res) {
  try {
    const doc = await States.find().exec()
    return response(res, 200, true, 'Successfully store state', doc.map(e => e.toObject))
  } catch (err) {
    console.error(err)
    return response(res, 401, false, 'Error occured while retrieving state', { code: err.code, message: err.message })
  }
}

export async function getState(req, res) {
  let { id } = req.params
  try {
    const doc = await new StateClass()
      .setStateId(id)
      .getState()
    return response(res, 200, true, 'Successfully store state', doc.toObject())
  } catch (err) {
    console.error(err)
    return response(res, 401, false, 'Error occured while retrieving state', { code: err.code, message: err.message })
  }
}

export async function updateState(req, res) {
  let { id } = req.params
  let { name, message } = req.body
  try {
    const doc = await new StateClass()
      .setStateId(id)
      .updateState(name, message)
    return response(res, 200, true, 'Successfully store state', doc.toObject())
  } catch (err) {
    console.error(err)
    return response(res, 401, false, 'Error occured while updating state', { code: err.code, message: err.message })
  }
}

export async function deleteState(req, res) {
  let { id } = req.params
  try {
    const doc = await new StateClass()
      .setStateId(id)
      .deleteState()
    return response(res, 200, true, 'Successfully store state', doc.toObject())
  } catch (err) {
    console.error(err)
    return response(res, 401, false, 'Error occured while deleting state', { code: err.code, message: err.message })
  }
}