import mongoose from 'mongoose'
import { Journies, ChatFlows, States } from "../models/MongoDBModel.js";

export default class JourneyClass {

  constructor() {
    this.journey_id = null,
    this.chatflow_id = null,
    this.current_state = null,
    this.next_state = null,
    this.option = null
  }



  /* <------------ Define ------------> */

  setJourneyId(journey_id) { this.journey_id = new mongoose.Types.ObjectId(journey_id); return this }
  setChatFlowId(chatflow_id) { this.chatflow_id = new mongoose.Types.ObjectId(chatflow_id); return this }
  setCurrentState(current_state) { this.current_state = new mongoose.Types.ObjectId(current_state); return this }
  setNextState(next_state) { this.next_state = new mongoose.Types.ObjectId(next_state); return this }
  setOption(option) { this.option = option; return this }



  /* <------------ Create, Read, Update, Delete ------------> */

  async storeJourney() {

    if (!(await ChatFlows.exists({
      _id: this.chatflow_id
    }) ?? false)) throw Error("this.chatflow_id doesn't find any key match with ChatFlows.chatflow_id")

    if (!(await States.exists({
      _id: this.current_state
    }) ?? false)) throw Error("this.current_state doesn't find any key match with States.state_id")

    if (!(await States.exists({
      _id: this.next_state
    }) ?? false)) throw Error("this.next_state doesn't find any key match with States.state_id")

    return await Journies.create({
      _id: this.journey_id ?? new mongoose.Types.ObjectId(),
      chatflow_id: this.chatflow_id,
      current_state: this.current_state,
      next_state: this.next_state,
      option: this.option
    })
  }

  async getJourneyByChatflowId() { return await Journies.findOne({ chatflow_id: this.chatflow_id }).exec() }

  async getJourneyByCurrentState() { return await Journies.findOne({ current_state: this.current_state }).exec() }

  async getJourneyByNextState() { return await Journies.findOne({ next_state: this.next_state }).exec() }

  async updateJourney(chatflow_id, current_state, next_state, option) {
    return await Journies
      .findByIdAndUpdate(
        this.journey_id,
        { chatflow_id, current_state, next_state, option }
      ).exec()
  }

  async deleteJourney() { return await Journies.deleteOne({ journey_id: this.journey_id }) }

}