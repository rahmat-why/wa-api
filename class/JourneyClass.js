import { randomBytes } from 'crypto'
import { Journeys, ChatFlows, States } from "../models/MongoDBModel.js";

export default class JourneyClass {

  constructor() {
    this.journey_id = null,
    this.chatflow_id = null,
    this.current_state = null,
    this.next_state = null,
    this.option = null
  }



  /* <------------ Define ------------> */

  setJourneyId(journey_id) { this.journey_id = journey_id; return this }
  setChatFlowId(chatflow_id) { this.chatflow_id = chatflow_id; return this }
  setCurrentState(current_state) { this.current_state = current_state; return this }
  setNextState(next_state) { this.next_state = next_state; return this }
  setOption(option) { this.option = option; return this }



  /* <------------ Create, Read, Update, Delete ------------> */

  async storeJourney() {
    await this.keyValidation()
    return await Journeys.create({
      _id: this.journey_id ?? randomBytes(12).toString('hex'),
      chatflow_id: this.chatflow_id,
      current_state: this.current_state,
      next_state: this.next_state,
      option: this.option
    })
  }

  async getJourney() { return await Journeys.findById(this.journey_id).exec() }

  async getJourneyByChatflowId() { return await Journeys.findOne({ chatflow_id: this.chatflow_id }).exec() }

  async getJourneyByCurrentState() { return await Journeys.findOne({ current_state: this.current_state }).exec() }

  async getJourneyByNextState() { return await Journeys.findOne({ next_state: this.next_state }).exec() }

  async updateJourney(chatflow_id, current_state, next_state, option) {
    await this.keyValidation()
    if (!(chatflow_id && current_state && next_state && option)) {
      let doc = await this.getJourney()
      return await Journeys.findByIdAndUpdate(this.journey_id, {
        chatflow_id: doc.chatflow_id ?? chatflow_id,
        current_state: doc.current_state ?? current_state,
        next_state: doc.next_state ?? next_state,
        option: doc.option ?? option,
      }).exec()
    }
    return await Journeys
      .findByIdAndUpdate(
        this.journey_id,
        { chatflow_id, current_state, next_state, option }
      ).exec()
  }

  async deleteJourney() { return await Journeys.findByIdAndDelete(this.journey_id).exec() }



  /* <------------ Checking related ChatFlow and State existance ------------> */

  async keyValidation() {

    if (!(await ChatFlows.exists({
      _id: this.chatflow_id
    }) ?? false)) throw Error("this.chatflow_id doesn't find any key match with ChatFlows.chatflow_id")

    if (!(await States.exists({
      _id: this.current_state
    }) ?? false)) throw Error("this.current_state doesn't find any key match with States.state_id")

    if (!(await States.exists({
      _id: this.next_state
    }) ?? false)) throw Error("this.next_state doesn't find any key match with States.state_id")

    return true
  }

}