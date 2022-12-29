import response from '../response.js'
import JourneyClass from '../class/JourneyClass.js'

export async function createJourney(req, res) {
  const { id: user_id } = req.verified_token
  let { id, chatflow_id, current_state, next_state, option } = req.body
  try {
    const doc = await new JourneyClass()
      .setJourneyId(id)
      .setUserId(user_id)
      .setChatFlowId(chatflow_id)
      .setCurrentState(current_state)
      .setNextState(next_state)
      .setOption(option)
      .storeJourney()
    return response(res, 201, true, 'Successfully store journey', doc.toObject())
  } catch (err) {
    console.error(err)
    return response(res, 500, false, err.message, {})
  }
}

export async function getAllJourney(req, res) {
  const { id: user_id } = req.verified_token
  try {
    const doc = await new JourneyClass()
      .setUserId(user_id)
      .getAllJourney()
    return response(res, 200, true, 'Successfully retrieve all journey', doc.map(e => e.toObject()))
  } catch (err) {
    console.error(err)
    return response(res, 500, false, err.message, {})
  }
}

export async function getJourney(req, res) {
  let { id } = req.params
  try {
    const doc = await new JourneyClass()
      .setJourneyId(id)
      .getJourney()
    return response(res, 200, true, 'Successfully retrieve journey', doc.toObject())
  } catch (err) {
    console.error(err)
    return response(res, 500, false, err.message, {})
  }
}

export async function updateJourney(req, res) {
  let { id } = req.params
  let { chatflow_id, current_state, next_state, option } = req.body
  try {
    const doc = await new JourneyClass()
      .setJourneyId(id)
      .updateJourney(chatflow_id, current_state, next_state, option)
    return response(res, 200, true, 'Successfully update journey', doc.toObject())
  } catch (err) {
    console.error(err)
    return response(res, 500, false, err.message, {})
  }
}

export async function deleteJourney(req, res) {
  let { id } = req.params
  try {
    const doc = await new JourneyClass()
      .setJourneyId(id)
      .deleteJourney()
    return response(res, 200, true, 'Successfully delete journey', doc.toObject())
  } catch (err) {
    console.error(err)
    return response(res, 500, false, err.message, {})
  }
}