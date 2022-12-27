import mongoose, { Schema } from 'mongoose'

export const States = mongoose.model('states', new Schema({
  name: String,
  message: String
}))

export const ChatFlows = mongoose.model('chatflows', new Schema({
  name: String,
  description: String
}))

export const Journies = mongoose.model('journies', new Schema({
  chatflow_id: mongoose.Types.ObjectId,
  current_state: mongoose.Types.ObjectId,
  next_state: mongoose.Types.ObjectId,
  option: String
}))