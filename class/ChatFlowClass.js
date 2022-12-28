import { randomBytes } from 'crypto'
import { ChatFlows } from '../models/MongoDBModel.js'

export default class ChatFlowClass {

  constructor() {
    this.chatflow_id = null,
    this.name = null,
    this.description = null
  }



  /* <------------ Define ------------> */

  setChatFlowId(chatflow_id) { this.chatflow_id = chatflow_id; return this }
  setName(name) { this.name = name; return this }
  setDescription(description) { this.description = description; return this }



  /* <------------ Create, Read, Update, Delete ------------> */

  async storeChatFlow() {
    return await ChatFlows.create({
      _id: this.chatflow_id ?? randomBytes(12).toString('hex'),
      name: this.name,
      description: this.description
    })
  }

  async getChatFlow() { return await ChatFlows.findById(this.chatflow_id).exec() }

  async updateChatFlow(name, description) {
    if (!(name && description)) {
      let doc = await this.getChatFlow()
      return await ChatFlows.findByIdAndUpdate(this.chatflow_id, {
        name: doc.name ?? name,
        description: doc.description ?? description
      }).exec()
    }
    return await ChatFlows.findByIdAndUpdate(this.chatflow_id, { name, description }).exec()
  }

  async deleteChatFlow() { return await ChatFlows.findByIdAndDelete(this.chatflow_id).exec() }

}