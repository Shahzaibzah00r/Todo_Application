const Admin = require("../Model/adminModal");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const jwtSecret = "mynameisShahzaib";
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const registerUser = async (req, res) => {
  try {
    const { fName, lName, email, password, cPassword } = req.body;

    const newData = await Admin.findOne({ email: email });
    if (newData) {
      return res
        .status(403)
        .json({ message: "This user is already registered" });
    }
    const hashPass = await bcrypt.hash(password, 10);
    if (password === cPassword) {
      const regUser = await Admin.create({
        fName,
        lName,
        email,
        password: hashPass,
        cPassword: hashPass,
      });
      await regUser.save();
      console.log("hashPass is: ", regUser.id);
      // const token = jwt.sign({ userId: regUser.id }, "zaib");

      return res.status(201).json({
        message: "This user has been registered",
        data: regUser.email,
      });
    } else {
      return res.status(501).json({
        message: "pass is not match",
        data: regUser.password,
      });
    }
  } catch (error) {
    console.log("exception: ", error);
    res
      .status(500)
      .json({ statusCode: 500, errorMessage: "pass is not match" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const newData = await Admin.findOne({ email: email });
    if (!newData) {
      return res.status(501).json({
        statusCode: 500,
        errorMessage: "This email is not registered...",
      });
    }

    const hashPass = await bcrypt.compare(password, newData.password);
    if (hashPass) {
      const { fName, lName, email, _id, profilePic } = newData;

      const token = jwt.sign({ _id }, jwtSecret);

      console.log("token in sign in:", token);
      return res.status(200).json({
        Message: "The user has been logged in...",
        userData: { fName, lName, email, token, profilePic },
      });
    } else {
      return res.status(404).json({
        statusCode: 404,
        Message: "Entered an invalid password",
      });
    }
  } catch (error) {
    console.log("exception: ", error);
    res.status(500).json({ statusCode: 500, errorMessage: error.message });
  }
};

const updateProfle = async (req, res) => {
  try {
    const { fName, lName, email, token } = req.body;
    // const fileName = req.file.originalname;
    // console.log("userin varrify:", req.file.originalname);
    const varryToken = jwt.verify(token, jwtSecret);
    const decodeTokenId = varryToken._id;
    if (decodeTokenId) {
      if (req.file) {
        const tempPath = path.join(
          __dirname,
          "../pictures",
          req.file.originalname
        );
        fs.writeFileSync(tempPath, req.file.buffer);
        const { secure_url } = await cloudinary.uploader.upload(tempPath, {
          resource_type: "auto",
        });
        // console.log("uploadRst", secure_url);
        // return secure_url;

        await Admin.findByIdAndUpdate(
          {
            _id: new mongoose.Types.ObjectId(decodeTokenId),
          },
          { fName, lName, profilePic: secure_url },
          { new: true }
        );
        const { profilePic } = await Admin.findById(
          new mongoose.Types.ObjectId(decodeTokenId)
        );
        // console.log("dbData Is: ", profilePic);
        return res.status(200).json({
          Message: "The user has been update...",
          userData: { fName, lName, email, token, profilePic },
        });
      } else {
        await Admin.findByIdAndUpdate(
          {
            _id: new mongoose.Types.ObjectId(decodeTokenId),
          },
          { fName, lName },
          { new: true }
        );
        const { profilePic } = await Admin.findById(
          new mongoose.Types.ObjectId(decodeTokenId)
        );
        // console.log("dbData Is: ", profilePic);
        return res.status(200).json({
          Message: "The user has been update...",
          userData: { fName, lName, email, token, profilePic },
        });
      }
    }
  } catch (error) {
    return res
      .status(400)
      .json({ msg: "something went wrong", Data: error.message });
  }
};

module.exports = { registerUser, loginUser, updateProfle };
