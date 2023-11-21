import express from 'express'
import {
  getUser,
  updateUser,
  deleteUser,
  followUser,
  unFollowUser,
  getAllUsers,
  getNotify,
  removeNotify,
  uploadUserImage,
} from '../Controller/UserController.js'
import authMiddleWare from '../MiddleWare/AuthMiddleWare.js'

const router = express.Router()

router.get('/', getAllUsers)
router.post('/upload', uploadUserImage)
router.put('/notify', removeNotify)
router.get('/:id', getUser)
router.put('/:id', authMiddleWare, updateUser)
router.delete('/:id', authMiddleWare, deleteUser)
router.put('/:id/follow', authMiddleWare, followUser)
router.put('/:id/unfollow', authMiddleWare, unFollowUser)
router.get('/:id/notify', getNotify)

export default router
