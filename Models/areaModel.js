import mongoose from 'mongoose'

const AreaSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

const areraModel = mongoose.model('area', AreaSchema)
export default areraModel
