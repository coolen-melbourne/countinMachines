import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { type: String, required: true, minlength: 6 }
  },
  { timestamps: true }
);

export default model('User', UserSchema);
