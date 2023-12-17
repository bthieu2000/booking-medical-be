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
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
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
    typeDisease: {type: Array},
    medicalExamination: {type: Array}
    // active: { type: Boolean, default: false },
  },
  { timestamps: true },
)

const userModel = mongoose.model('users', UserSchema)
export default userModel
