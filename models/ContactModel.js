import mongoose from 'mongoose'

const { Schema, model } = mongoose

const contactSchema = new Schema({
  telp: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  profile_picture: String,
  folder_ids: { type: [String], required: true }
})

export const Contact = model('contact', contactSchema)
