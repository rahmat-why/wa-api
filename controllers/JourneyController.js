import response from '../response.js'
import JourneyClass from '../class/JourneyClass.js'
import { Journeys } from '../models/MongoDBModel.js'

export async function createJourney(req, res) {
  let { id, chatflow_id, current_state, next_state, option } = req.body
  try {
    const doc = await new JourneyClass()
      .setJourneyId(id)
      .setChatFlowId(chatflow_id)
      .setCurrentState(current_state)
      .setNextState(next_state)
      .setOption(option)
      .storeJourney()
    return response(res, 200, true, 'Successfully store journey', doc.toObject())
  } catch (err) {
    console.error(err)
    return response(res, 401, false, 'Error occured while storing journey', { code: err.code, message: err.message })
  }
}

export async function getAllJourney(req, res) {
  try {
    const doc = await Journeys.find().exec()
    return response(res, 200, true, 'Successfully store journey', doc.map(e => e.toObject))
  } catch (err) {
    console.error(err)
    return response(res, 401, false, 'Error occured while retrieving journey', { code: err.code, message: err.message })
  }
}

export async function getJourney(req, res) {
  let { id } = req.params
  try {
    const doc = await new JourneyClass()
      .setJourneyId(id)
      .getJourney()
    return response(res, 200, true, 'Successfully store journey', doc.toObject())
  } catch (err) {
    console.error(err)
    return response(res, 401, false, 'Error occured while retrieving journey', { code: err.code, message: err.message })
  }
}

export async function updateJourney(req, res) {
  let { id } = req.params
  let { chatflow_id, current_state, next_state, option } = req.body
  try {
    const doc = await new JourneyClass()
      .setJourneyId(id)
      .updateJourney(chatflow_id, current_state, next_state, option)
    return response(res, 200, true, 'Successfully store journey', doc.toObject())
  } catch (err) {
    console.error(err)
    return response(res, 401, false, 'Error occured while updating journey', { code: err.code, message: err.message })
  }
}

export async function deleteJourney(req, res) {
  let { id } = req.params
  try {
    const doc = await new JourneyClass()
      .setJourneyId(id)
      .deleteJourney()
    return response(res, 200, true, 'Successfully store journey', doc.toObject())
  } catch (err) {
    console.error(err)
    return response(res, 401, false, 'Error occured while deleting journey', { code: err.code, message: err.message })
  }
}