import mongoose from "mongoose"

if (!process.env.MONGO_URI) {
  console.log('Please provide MONGO_URI')
  process.exit()
}

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MDB Connected Successfully')
})
