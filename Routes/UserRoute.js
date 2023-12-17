import express from 'express'
import {
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
  uploadUserImage,
  createDoctor,
} from '../Controller/UserController.js'
import authMiddleWare from '../MiddleWare/AuthMiddleWare.js'

const router = express.Router()

router.get('/', getAllUsers)
router.post('/upload', uploadUserImage)
router.post('/create-doctor/:id', createDoctor)
router.get('/:id', getUser)
router.put('/:id', authMiddleWare, updateUser)
router.delete('/:id', authMiddleWare, deleteUser)

export default router
