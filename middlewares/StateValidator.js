import { States } from "../models/MongoDBModel.js"
import response from "../response.js"

export async function stateValidator(req, res, next) {

  const { id: user_id } = req.verified_token
  const { id } = req.params

  try {
    const state = await States.findById(id).exec()
    if (state) {
      if (state.user_id === user_id) return next()
      return response(res, 403, false, "You don't have permission to access this state")
    } else {
      return response(res, 404, false, `No state associated with id: ${id}`)
    }
  } catch(err) {
    console.error(err)
    return response(res, 401, false, err.message, {})
  }
}