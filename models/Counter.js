import mongoose from 'mongoose'

const counterSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  seq: { type: Number, default: 0 }
})

export default mongoose.model('Counter', counterSchema)
