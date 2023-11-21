import mongoose from 'mongoose'

const PostSchema = mongoose.Schema(
  {
    userId: {
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

const postModel = mongoose.model('posts', PostSchema)
export default postModel
