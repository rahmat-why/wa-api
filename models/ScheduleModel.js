import mongoose from "mongoose"

const { Schema, model } = mongoose

const scheduleSchema = new Schema({
  title: String,
  totalReceiver: Number,
  userId: Number,
  createFrom: String,
  folderId: String
})
const scheduleReceiverSchema = new Schema({
  scheduleId: mongoose.Types.ObjectId,
  deviceId: String,
  telp: String,
  category: String,
  scheduleTime: String,
  message: String
})

export const Schedule = model("schedule", scheduleSchema)
export const ScheduleReceiver = model("scheduleReceiver", scheduleReceiverSchema)
