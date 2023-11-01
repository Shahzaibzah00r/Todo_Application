const express = require("express");
// const upload = require("../Utils/pictureUpload");
const router = express.Router();
const {
  registerUser,
  loginUser,
  updateProfle,
} = require("../Controller/registerController");
const upload = require("../Utils/pictureUploader");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/updateProfle", upload, updateProfle);

module.exports = router;
