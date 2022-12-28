import { randomBytes } from 'crypto'
import { States } from '../models/MongoDBModel.js'

export default class StateClass {

  constructor() {
    this.state_id = null
    this.name = null
    this.message = null
  }



  /* <------------ Define ------------> */

  setStateId(state_id) { this.state_id = state_id; return this }
  setName(name) { this.name = name; return this }
  setMessage(message) { this.message = message; return this }



  /* <------------ Create, Read, Update, Delete ------------> */

  async storeState() {
    return await States.create({
      _id: this.state_id ?? randomBytes(12).toString('hex'),
      name: this.name,
      message: this.message
    })
  }

  async getState() { return await States.findById(this.state_id).exec() }

  async updateState(name, message) {
    if (!(name && message)) {
      let doc = await this.getState()
      return await States.findByIdAndUpdate(this.state_id, {
        name: doc.name ?? name,
        message: doc.message ?? message
      }).exec()
    }
    return await States.findByIdAndUpdate(this.state_id, { name, message }).exec()
  }

  async deleteState() { return await States.findByIdAndDelete(this.state_id).exec() }

}