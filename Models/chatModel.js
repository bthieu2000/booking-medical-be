import mongoose from 'mongoose'

const ChatSchema = mongoose.Schema(
  {
    members: { type: Array },
  },
  { timestamps: true },
)
const chatModel = mongoose.model('chat', ChatSchema)
export default chatModel
