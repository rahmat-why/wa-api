import mongoose, { Schema } from 'mongoose'

export const States = mongoose.model('states', new Schema({
  _id: String,
  name: String,
  message: String
}))

export const ChatFlows = mongoose.model('chatflows', new Schema({
  _id: String,
  name: String,
  description: String
}))

export const Journeys = mongoose.model('journeys', new Schema({
  _id: String,
  chatflow_id: mongoose.Types.ObjectId,
  current_state: mongoose.Types.ObjectId,
  next_state: mongoose.Types.ObjectId,
  option: String
}))