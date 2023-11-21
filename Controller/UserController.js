import userModel from '../Models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
})

// Get User
export const getUser = async (req, res) => {
  const id = req.params.id
  try {
    const user = await userModel.findById(id)
    const { password, ...other } = user._doc
    if (user) {
      res.status(200).json(other)
    } else res.status(404).json('no such user exists')
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get all User
export const getAllUsers = async (req, res) => {
  try {
    let users = await userModel.find()
    users = users.map((user) => {
      const { password, ...other } = user._doc
      return other
    })
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// update User
export const updateUser = async (req, res) => {
  const id = req.params.id
  const { _id, oldPassword, password } = req.body

  if (id === _id) {
    try {
      if (password) {
        const oldUser = await userModel.findById(id)
        const verify = await bcrypt.compare(oldPassword, oldUser.password)
        if (verify) {
          const salt = await bcrypt.genSalt(10)
          const newPassword = await bcrypt.hash(password, salt)
          const user = await userModel.findByIdAndUpdate(
            id,
            { password: newPassword },
            { new: true },
          )
          const token = jwt.sign(
            {
              username: user.username,
              id: user._id,
            },
            process.env.JWT_KEY,
          )
          res.status(200).json({ user, token })
        } else res.status(400).json('Mật khẩu cũ không đúng')
      } else {
        const user = await userModel.findByIdAndUpdate(id, req.body, {
          new: true,
        })
        const token = jwt.sign(
          {
            username: user.username,
            id: user._id,
          },
          process.env.JWT_KEY,
        )
        res.status(200).json({ user, token })
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  } else
    res.status(403).json('Access Denied! You can`t update your own profile')
}

//delete User
export const deleteUser = async (req, res) => {
  const id = req.params.id
  const { currentUserId, AdminStatus } = req.body

  if (id === currentUserId || AdminStatus) {
    try {
      await userModel.findByIdAndDelete(id)
      res.status(200).json('User Deleteed')
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  } else
    res.status(403).json('Access Denied! You can`t delete your own profile')
}

// follow User
export const followUser = async (req, res) => {
  const id = req.params.id
  const { _id } = req.body // CurrentUserId
  if (id === _id) {
    res.status(403).json("You can't follow yourseft")
  } else {
    try {
      const followUser = await userModel.findById(id)
      const followingUser = await userModel.findById(_id)
      if (!followUser.followers.includes(_id)) {
        await followUser.updateOne({ $push: { followers: _id } })
        await followingUser.updateOne({ $push: { following: id } })
        res.status(200).json('Following')
      } else {
        res.status(403).json('You are already following this id')
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

// Unfollow User
export const unFollowUser = async (req, res) => {
  const id = req.params.id
  const { _id } = req.body //CurrentUserId
  if (_id === id) {
    res.status(403).json('Action Forbidden')
  } else {
    try {
      const unFollowUser = await userModel.findById(id)
      const unFollowingUser = await userModel.findById(_id)

      if (unFollowUser.followers.includes(_id)) {
        await unFollowUser.updateOne({ $pull: { followers: _id } })
        await unFollowingUser.updateOne({ $pull: { following: id } })
        res.status(200).json('Unfollowed')
      } else {
        res.status(403).json('You are not following this User')
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

// Get Notify
export const getNotify = async (req, res) => {
  const id = req.params.id
  try {
    const { notifications } = await userModel.findById(id)
    res.status(200).json(notifications)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Remove Notify
export const removeNotify = async (req, res) => {
  const { userId, notifyId } = req.body
  try {
    const notifyUser = await userModel.findById(userId)
    await notifyUser.updateOne({
      $pull: { notifications: { notifyId: notifyId } },
    })
    res.status(200).json('removed notify')
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Upload image (avt, coverPic)
export const uploadUserImage = async (req, res) => {
  const { profilePicture, coverPicture } = req.body
  try {
    if (profilePicture) {
      const result = await cloudinary.uploader.upload(profilePicture, {
        upload_preset: 'upload_avatar_unsigned',
        allowed_formats: ['png', 'jpg', 'jpeg', 'svg', 'ico', 'jfif'],
      })
      res
        .status(200)
        .json({ public_id: result.public_id, url: result.secure_url })
    }
    if (coverPicture) {
      const result = await cloudinary.uploader.upload(coverPicture, {
        upload_preset: 'upload_coverpicture_unsigned',
        allowed_formats: ['png', 'jpg', 'jpeg', 'svg', 'ico', 'jfif'],
      })
      res
        .status(200)
        .json({ public_id: result.public_id, url: result.secure_url })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
