// import postModel from '../Models/postModel.js'
import typeDiseaseModel from '../Models/typeDiseaseModel.js'
import userModel from '../Models/userModel.js'
import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

// Create
export const createTypeDisease = async (req, res) => {
  const { nameDisease, codeDisease } = req.body
  try {
      const newTypeDisease = new typeDiseaseModel(req.body)
      await newTypeDisease.save()
      res.status(200).json({status: 1})
  } catch (error) {
    res.status(500).json(error)
  }
}

// Get post for hastags
export const getTypeDisease = async (req, res) => {
  try {
    const typeDisease = await typeDiseaseModel.find()
    res.status(200).json(typeDisease)
  } catch (error) {
    res.status(500).json(error)
  }
}

// Get Post
export const getPost = async (req, res) => {
  const postId = req.params.id
  try {
    const post = await postModel.findById(postId)
    res.status(200).json(post)
  } catch (error) {
    res.status(500).json(error)
  }
}

// Get all posts (Sort by likes)
export const getAllPosts = async (req, res) => {
  try {
    const posts = await postModel.find().sort({ likes: -1 })
    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json(error)
  }
}

// Update Post
export const updatePost = async (req, res) => {
  const postId = req.params.id
  const { currentUserId } = req.body
  try {
    const post = await postModel.findById(postId)
    if (post.userId === currentUserId) {
      await post.updateOne({ $set: req.body })
      const postUpdated = await postModel.findById(postId)
      res.status(200).json(postUpdated)
    } else res.status(403).json('UPDATE FAIL: This is not your post')
  } catch (error) {
    res.status(500).json(error)
  }
}

// Delete Post
export const deletePost = async (req, res) => {
  const postId = req.params.id
  const { currentUserId } = req.body
  try {
    const post = await postModel.findById(postId)
    if (post.userId === currentUserId) {
      await post.deleteOne()
      res.status(200).json('Deleted Post')
    } else res.status(403).json('DELETE FAIL:  This is not your post')
  } catch (error) {
    res.status(500).json(error)
  }
}

// Like/Unlike Post
export const likePost = async (req, res) => {
  const postId = req.params.id
  const { currentUserId } = req.body
  try {
    const post = await postModel.findById(postId)
    if (!post.likes.includes(currentUserId)) {
      await post.updateOne({ $push: { likes: currentUserId } })
      // push notify to author user
      const user = await userModel.findById(post.userId)
      if (currentUserId !== post.userId) {
        await user.updateOne({
          $push: {
            notifications: {
              notifyId: uuidv4(),
              userId: currentUserId,
              postId: postId,
              type: 'like',
            },
          },
        })
      }
      res.status(200).json('Post liked')
    } else {
      await post.updateOne({ $pull: { likes: currentUserId } })
      res.status(200).json('Post Unliked')
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

// Get Post of user following
export const getTimelinePosts = async (req, res) => {
  const currentUserId = req.params.id
  try {
    const currentUserPosts = await postModel.find({ userId: currentUserId })
    const postUserFollowing = await userModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(currentUserId),
        },
      },
      {
        $lookup: {
          from: 'posts',
          localField: 'following',
          foreignField: 'userId',
          as: 'postUserFollowing',
        },
      },
      {
        $project: {
          postUserFollowing: 1,
          _id: 0,
        },
      },
    ])
    res.status(200).json(
      currentUserPosts
        .concat(...postUserFollowing[0].postUserFollowing)
        .sort((a, b) => {
          return new Date(b.updatedAt) - new Date(a.updatedAt)
        }),
    )
  } catch (error) {
    res.status(500).json(error)
  }
}

// Add comment
export const addComment = async (req, res) => {
  const postId = req.params.id
  const { currentUserId, text } = req.body
  const datecmt = new Date(Date.now())
  try {
    const post = await postModel.findById(postId)
    await post.updateOne({
      $push: {
        comments: {
          userId: currentUserId,
          text: text,
          date_added: datecmt,
        },
      },
    })
    // push notify to author user
    const user = await userModel.findById(post.userId)
    if (currentUserId !== post.userId) {
      await user.updateOne({
        $push: {
          notifications: {
            notifyId: uuidv4(),
            userId: currentUserId,
            postId: postId,
            type: 'comment',
          },
        },
      })
    }
    res.status(200).json({ userId: currentUserId, text: text })
  } catch (error) {
    res.status(500).json(error)
  }
}

// Get comments
export const getComments = async (req, res) => {
  const postId = req.params.id
  try {
    const { comments } = await postModel.findById(postId)

    comments.sort((a, b) => {
      return new Date(b.date_added) - new Date(a.date_added)
    })

    res.status(200).json(comments)
  } catch (error) {
    res.status(500).json(error)
  }
}

// Get post last week
export const getPostLastWeek = async (req, res) => {
  try {
    const posts = await postModel.find({
      createdAt: {
        $gte: new Date(new Date(Date.now()) - 7 * 60 * 60 * 24 * 1000),
      },
    })
    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json(error)
  }
}

// Report Post
export const reportPost = async (req, res) => {
  const postId = req.params.id
  const { userId } = req.body
  try {
    const post = await postModel.findById(postId)
    await post.updateOne({ $push: { report: userId } })
    res.status(200).json('Report Success')
  } catch (error) {
    res.status(500).json(error)
  }
}

// Get posts report
export const getPostsReport = async (req, res) => {
  try {
    const posts = await postModel.find({ 'report.0': { $exists: true } })
    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json(error)
  }
}
