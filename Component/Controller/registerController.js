const Admin = require("../Model/adminModal");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const mongoose = require("mongoose");
const jwtSecret = "mynameisShahzaib";
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const loginGoogle = async (req, res) => {
  try {
    const userInfo = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { Authorization: `Bearer ${req.headers.authorization}` } }
    );
    const newData = await Admin.findOne({ email: userInfo.data.email });
    if (newData) {
      const { fName, lName, email, _id, profilePic } = newData;
      const token = jwt.sign({ _id }, jwtSecret);
      return res.status(200).json({
        Message: "The user has been logged in...",
        userData: { fName, lName, email, token, profilePic },
      });
    } else {
      const regUserGoogle = await Admin.create({
        fName: userInfo.data.given_name,
        lName: userInfo.data.family_name,
        email: userInfo.data.email,
        password: userInfo.data.sub,
        cPassword: userInfo.data.sub,
        profilePic: userInfo.data.picture,
      });
      await regUserGoogle.save();
      const { fName, lName, email, profilePic } = regUserGoogle;
      return res.status(200).json({
        Message: "The user has been registered and logged in by google...",
        userData: { fName, lName, email, profilePic },
      });
    }
  } catch (error) {
    console.log("exception: ", error);
    res.status(500).json({
      statusCode: 500,
      errorMessage: "couldn't fine headrers in google login",
    });
  }
};

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
    res.status(500).json({ statusCode: 500, errorMessage: error.message });
  }
};

const updateProfle = async (req, res) => {
  try {
    const { fName, lName, email, token } = req.body;
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

module.exports = { registerUser, loginUser, updateProfle, loginGoogle };
