import mongoose from 'mongoose'
import { States } from '../models/MongoDBModel.js'

export default class StateClass {

  constructor() {
    this.state_id = null,
    this.name = null,
    this.message = null
  }



  /* <------------ Define ------------> */

  setStateId(state_id) { this.state_id = new mongoose.Types.ObjectId(state_id); return this }
  setName(name) { this.name = name; return this }
  setMessage(message) { this.message = message; return this }


  
  /* <------------ Create, Read, Update, Delete ------------> */

  async storeState() {
    return await States.create({
      _id: this.state_id ?? new mongoose.Types.ObjectId(),
      name: this.name,
      message: this.message
    })
  }

  async getState() { return await States.findOne({ name: this.name }).exec() }

  async updateState(name, message) {
    return await States.findOneAndUpdate({ name: this.name }, { name, message }).exec()
  }

  async deleteState() { return await States.deleteOne({ name: this.name }) }

}