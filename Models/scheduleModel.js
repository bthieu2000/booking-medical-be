import mongoose from 'mongoose'

const ScheduleMSchema = mongoose.Schema(
  {
    doctorId: {
      type: String,
      required: true,
    },
    desc: String,
    likes: [],
    image: {
      public_id: { type: String },
      url: { type: String },
    },
    video: {
      public_id: { type: String },
      url: { type: String },
    },
    hastags: [],
    status: String,
    comments: { type: Array },
    report: [],
  },
  {
    timestamps: true,
  },
)

const scheduleModel = mongoose.model('posts', ScheduleMSchema)
export default scheduleModel
