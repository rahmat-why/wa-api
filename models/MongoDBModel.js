import mongoose, { Schema } from 'mongoose'

export const States = mongoose.model('states', new Schema({
  _id: String,
  user_id: Number,
  name: String,
  message: String
}))

export const ChatFlows = mongoose.model('chatflows', new Schema({
  _id: String,
  user_id: Number,
  name: String,
  description: String
}))

export const Journeys = mongoose.model('journeys', new Schema({
  _id: String,
  user_id: Number,
  chatflow_id: String,
  current_state: String,
  next_state: String,
  option: String
}))