import { Schema, model } from 'mongoose'

const ProductSchema = new Schema({
  number: { type: Number, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String, required: true },
  date: { type: Date, required: true },
  name: { type: String, required: true, trim: true },
  serial: { type: String, required: true, unique: true },
  machineName: { type: String, required: true, trim: true },   // 🔹 qo‘shildi
  modelNumber: { type: String, required: true, trim: true },  // 🔹 qo‘shildi
  comment: { type: String, default: '' },
  rating: {
  type: Number,
  default: 0,
  min: 0,
  max: 5
}

}, { timestamps: true })

export default model('Product', ProductSchema)
