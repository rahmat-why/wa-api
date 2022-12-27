import mongoose from 'mongoose'
import { ChatFlows } from '../models/MongoDBModel.js'

export default class ChatFlowClass {

  constructor() {
    this.chatflow_id = null,
    this.name = null,
    this.description = null
  }



  /* <------------ Define ------------> */

  setChatFlowId(chatflow_id) { this.chatflow_id = new mongoose.Types.ObjectId(chatflow_id); return this }
  setName(name) { this.name = name; return this }
  setDescription(description) { this.description = description; return this }



  /* <------------ Create, Read, Update, Delete ------------> */

  async storeChatFlow() {
    return await ChatFlows.create({
      _id: this.chatflow_id ?? new mongoose.Types.ObjectId(),
      name: this.name,
      description: this.description
    })
  }

  async getChatFlow() { return await ChatFlows.findOne({ name: this.name }).exec() }

  async updateChatFlow(name, description) {
    return await ChatFlows.findOneAndUpdate({ name: this.name }, { name, description }).exec()
  }

  async deleteChatFlow() { return await ChatFlows.deleteOne({ name: this.name }) }

}