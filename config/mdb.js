import mongoose from "mongoose"

if (!process.env.MDB_URI) {
  console.log('Please provide MDB_URI')
  process.exit()
}

mongoose.connect(process.env.MDB_URI).then(() => {
  console.log('MDB Connected Successfully')
})
