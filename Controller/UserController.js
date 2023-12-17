import userModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});

// Create User (BS)
export const createDoctor = async (req, res) => {
  const id = req.params.id;
  const { username, firstName, lastName } = req.body;
  try {
    const user = await userModel.findById(id);
    if (user?.role === "ADMIN") {
      // check tồn tại username
      const oldUser = await userModel.findOne({ username })
      if (oldUser) {
        return res.status(400).json('Người dùng đã tồn tại')
      }
      // tạo mật khẩu mặc định cho bs
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash("123456", salt);
      const newUser = new userModel({
        username: username,
        firstname: firstName,
        lastname: lastName,
        role: "BS",
        password: hashedPass,
      })
      await newUser.save()
      res.status(200).json({ status: 1 });
    } else res.status(403).json("Tài khoản không có quyền");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User
export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await userModel.findById(id);
    const { password, ...other } = user._doc;
    if (user) {
      res.status(200).json(other);
    } else res.status(404).json("no such user exists");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all User
export const getAllUsers = async (req, res) => {
  try {
    let users = await userModel.find();
    users = users.map((user) => {
      const { password, ...other } = user._doc;
      return other;
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update User
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { _id, oldPassword, password } = req.body;

  if (id === _id) {
    try {
      if (password) {
        const oldUser = await userModel.findById(id);
        const verify = await bcrypt.compare(oldPassword, oldUser.password);
        if (verify) {
          const salt = await bcrypt.genSalt(10);
          const newPassword = await bcrypt.hash(password, salt);
          const user = await userModel.findByIdAndUpdate(
            id,
            { password: newPassword },
            { new: true }
          );
          const token = jwt.sign(
            {
              username: user.username,
              id: user._id,
            },
            process.env.JWT_KEY
          );
          res.status(200).json({ user, token });
        } else res.status(400).json("Mật khẩu cũ không đúng");
      } else {
        const user = await userModel.findByIdAndUpdate(id, req.body, {
          new: true,
        });
        const token = jwt.sign(
          {
            username: user.username,
            id: user._id,
          },
          process.env.JWT_KEY
        );
        res.status(200).json({ user, token });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else
    res.status(403).json("Access Denied! You can`t update your own profile");
};

//delete User
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, AdminStatus } = req.body;

  if (id === currentUserId || AdminStatus) {
    try {
      await userModel.findByIdAndDelete(id);
      res.status(200).json("User Deleteed");
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else
    res.status(403).json("Access Denied! You can`t delete your own profile");
};

// Upload image (avt, coverPic)
export const uploadUserImage = async (req, res) => {
  const { profilePicture, coverPicture } = req.body;
  try {
    if (profilePicture) {
      const result = await cloudinary.uploader.upload(profilePicture, {
        upload_preset: "upload_avatar_unsigned",
        allowed_formats: ["png", "jpg", "jpeg", "svg", "ico", "jfif"],
      });
      res
        .status(200)
        .json({ public_id: result.public_id, url: result.secure_url });
    }
    if (coverPicture) {
      const result = await cloudinary.uploader.upload(coverPicture, {
        upload_preset: "upload_coverpicture_unsigned",
        allowed_formats: ["png", "jpg", "jpeg", "svg", "ico", "jfif"],
      });
      res
        .status(200)
        .json({ public_id: result.public_id, url: result.secure_url });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
