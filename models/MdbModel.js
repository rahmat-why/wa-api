import mongoose from "mongoose"

const { Schema, model } = mongoose

const scheduleSchema = new Schema({
  scheduleId: String,
  title: String,
  totalReceiver: Number,
  userId: Number,
  createFrom: String,
  folderId: String
})

const scheduleReceiverSchema = new Schema({
  scheduleId: String,
  deviceId: String,
  telp: String,
  category: String,
  scheduleTime: String,
  message: String
})

const contactSchema = new Schema({
  telp: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  profile_picture: String,
  folder_ids: { type: [String], required: true }
})

export const Schedule = model("schedule", scheduleSchema)
export const ScheduleReceiver = model("scheduleReceiver", scheduleReceiverSchema)
export const Contact = model('contact', contactSchema)
