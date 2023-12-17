import mongoose from 'mongoose'

const TypeDiseaseSchema = mongoose.Schema(
  {
    nameDisease: {
      type: String,
      required: true,
    },
    codeDisease: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

const typeDiseaseModel = mongoose.model('typedisease', TypeDiseaseSchema)
export default typeDiseaseModel
