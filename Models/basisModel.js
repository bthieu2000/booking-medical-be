import mongoose from 'mongoose'

const BasisSchema = mongoose.Schema(
  {
    name: { type: String },
    address: {type: String},
    doctor: { type: Array },
  },
  { timestamps: true },
)
const basisModel = mongoose.model('basis', BasisSchema)
export default basisModel
