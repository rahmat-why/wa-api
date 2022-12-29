import { randomBytes } from 'crypto'
import { Journeys, ChatFlows, States } from "../models/MongoDBModel.js";

export default class JourneyClass {

  constructor() {
    this.journey_id = null
    this.user_id = null
    this.chatflow_id = null
    this.current_state = null
    this.next_state = null
    this.option = null
  }



  /* <------------ Define ------------> */

  setJourneyId(journey_id) { this.journey_id = journey_id; return this }
  setUserId(user_id) { this.user_id = user_id; return this }
  setChatFlowId(chatflow_id) { this.chatflow_id = chatflow_id; return this }
  setCurrentState(current_state) { this.current_state = current_state; return this }
  setNextState(next_state) { this.next_state = next_state; return this }
  setOption(option) { this.option = option; return this }



  /* <------------ Create, Read, Update, Delete ------------> */

  async storeJourney() {
    return await Journeys.create({
      _id: this.journey_id ?? randomBytes(12).toString('hex'),
      user_id: this.user_id,
      chatflow_id: this.chatflow_id,
      current_state: this.current_state,
      next_state: this.next_state,
      option: this.option
    })
  }

  async getAllJourney() { return await Journeys.find({user_id: this.user_id}).exec() }

  async getJourney() { return await Journeys.findById(this.journey_id).exec() }

  /* async getJourneyByChatflowId() { return await Journeys.findOne({ chatflow_id: this.chatflow_id }).exec() }

  async getJourneyByCurrentState() { return await Journeys.findOne({ current_state: this.current_state }).exec() }

  async getJourneyByNextState() { return await Journeys.findOne({ next_state: this.next_state }).exec() } */

  async updateJourney(chatflow_id, current_state, next_state, option) {
    return await Journeys.findByIdAndUpdate(this.journey_id, {
      chatflow_id: chatflow_id,
      current_state: current_state,
      next_state: next_state,
      option: option,
      $inc: { __v: 1 }
    }, { new: true }).exec()
  }

  async deleteJourney() { return await Journeys.findByIdAndDelete(this.journey_id, { new: true }).exec() }

}