const express = require("express");
const router = express.Router();
const {
  postUsers,
  getUsers,
  getUser,
  deleteUser,
  updateUser,
  pictureUpload,
} = require("../Controller/usersController");
const upload = require("../Utils/pictureUploader");

router.post("/post", postUsers);
router.post("/upload", upload, pictureUpload);
router.post("/", getUsers);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);
// router.patch("/:id", updateUser);

module.exports = router;
