import mongoose, { Schema } from 'mongoose';

mongoose.connect(process.env['MONGO_URI'])

export const States = mongoose.model('states', new Schema({
  state_id: {
    type: String,
    index: true,
    unique: true
  },
  user_id: Number,
  name: String,
  message: String
}))

export const ChatFlows = mongoose.model('chatflows', new Schema({
  chatflow_id: {
    type: String,
    index: true,
    unique: true
  },
  user_id: Number,
  name: String,
  description: String
}))

export const Journeys = mongoose.model('journeys', new Schema({
  journey_id: {
    type: String,
    index: true,
    unique: true
  },
  user_id: Number,
  chatflow_id: String,
  current_state: String,
  next_state: String,
  option: String
}))

export const Folders = mongoose.model('folder_contacts', new Schema({
  folder_contact_id: {
    type: String,
    index: true,
    unique: true
  },
  user_id: Number,
  name: String,
  is_active: Boolean
}))

export const Contacts = mongoose.model('contacts', new Schema({
  contact_id: {
    type: String,
    index: true,
    unique: true
  },
  user_id: Number,
  folder_contact_id: String,
  name: String,
  telp: String,
  profile_picture: String
}))
