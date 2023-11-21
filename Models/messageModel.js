import mongoose from 'mongoose'

const MessagaSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
    },
    senderId: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  { timestamps: true },
)
const messagesModel = mongoose.model('messages', MessagaSchema)
export default messagesModel
