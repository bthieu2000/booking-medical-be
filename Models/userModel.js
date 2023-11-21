import mongoose from 'mongoose'

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "BN", // BN - BS - CTV - QTV 
    },
    profilePicture: {
      public_id: { type: String },
      url: { type: String },
    },
    phoneNum: Number,
    address: String,
    email: String,
    
    // active: { type: Boolean, default: false },
  },
  { timestamps: true },
)

const userModel = mongoose.model('users', UserSchema)
export default userModel
