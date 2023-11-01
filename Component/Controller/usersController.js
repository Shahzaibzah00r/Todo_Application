const Users = require("../Model/usersModal");
const cloudinary = require("cloudinary").v2;
const Admin = require("../Model/adminModal");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
require("dotenv").configDotenv();

const postUsers = async (req, res) => {
  try {
    const { title, content, category, email } = req.body;
    console.log("email from fornt to server in post:", email);
    const time = new Date();
    const currentDate =
      time.toLocaleDateString() + " " + time.toLocaleTimeString();

    const data = await Users.findOne({
      title: title,
    });
    if (data) {
      console.log("alrady", data.title);
      return res.status(400).json({ Data: data.title });
    } else {
      const usersObjId = await Admin.findOne({ email: email });
      if (usersObjId) {
        const newUser = await Users.create({
          title: title,
          content: content,
          category: category,
          currentDate,
          users: usersObjId._id,
        });

        console.log("print in post section of admin: ", usersObjId.id);
        return res
          .status(200)
          .json({ message: "successfully uploaded", data: newUser });
      }
    }
  } catch (error) {
    console.log("exception: ", error);
    return res.status(500).json({ statusCode: 500, errorIs: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const { email } = req.body;

    const adminEmail = await Admin.findOne({ email: email });
    if (adminEmail) {
      const uniqueUser = adminEmail.id;
      const users = await Users.find({
        users: new mongoose.Types.ObjectId(uniqueUser),
      });
      // console.log("email in get:", adminEmail);

      return res.status(200).json({ user: users });
    }
  } catch (error) {
    return res.status(400).json({ Data: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    // console.log("in if con:");

    const id = req.params.id;
    console.log("id is: ", id);
    const Objectid = require("mongodb").ObjectId;
    if (Objectid.isValid(id)) {
      const users = await Users.findOne({
        _id: new mongoose.Types.ObjectId(id),
      });
      console.log("in the upper if condition :", users);
      if (users) {
        console.log("In the if condition :", users);
        return res.status(200).json({ User: users });
      }
    } else {
      return res.status(400).json({ "Input id is incorrect": id });
    }
  } catch (error) {
    res.status(400).json({ Data: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const ObjectId = require("mongodb").ObjectId;
    if (ObjectId.isValid(id)) {
      const delUser = await Users.deleteOne({
        _id: new mongoose.Types.ObjectId(id),
      });
      console.log(delUser);
      return res.status(200).json({ DeleteUser: delUser });
    }
  } catch (error) {
    return res.status(400).json({ Data: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("id", id);
    // title = "Hello Shah G";
    const ObjectId = require("mongodb").ObjectId;
    if (ObjectId.isValid(id)) {
      const upUser = await Users.findByIdAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(id),
        },
        req.body,
        { new: true }
      );
      // console.log(upUser);
      return res.status(200).json({ UpdateUser: upUser });
    }
  } catch (error) {
    return res.status(400).json({ Data: error });
  }
};

const pictureUpload = async (req, res) => {
  try {
    // console.log("imageis", req.file.buffer);
    if (!req.file) {
      return res.status(400).json({ file: "no file seleted" });
    }

    const tempPath = path.join(__dirname, "../pictures", req.file.originalname);
    fs.writeFileSync(tempPath, req.file.buffer);
    const uploadRst = await cloudinary.uploader.upload(tempPath, {
      resource_type: "auto",
    });
    console.log("uploadRst", uploadRst.secure_url);
  } catch (error) {
    return res.status(400).json({ Data: error.message });
  }
};

module.exports = {
  postUsers,
  getUsers,
  getUser,
  deleteUser,
  updateUser,
  pictureUpload,
};
