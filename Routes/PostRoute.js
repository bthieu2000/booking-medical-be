import express from 'express'
import {
  createPost,
  deletePost,
  getPost,
  likePost,
  updatePost,
  getTimelinePosts,
  getAllPosts,
  addComment,
  getComments,
  getPostLastWeek,
  getPostForHastag,
  reportPost,
  getPostsReport,
} from '../Controller/PostController.js'

const router = express.Router()

router.post('/', createPost)
router.get('/', getAllPosts)
router.get('/lastweek', getPostLastWeek)
router.get('/report', getPostsReport)
router.get('/:id', getPost)
router.get('/:hastag/hastag', getPostForHastag)
router.put('/:id', updatePost)
router.delete('/:id', deletePost)
router.put('/:id/like', likePost)
router.put('/:id/report', reportPost)
router.get('/:id/timeline', getTimelinePosts)
router.put('/:id/comment', addComment)
router.get('/:id/comment', getComments)

export default router
