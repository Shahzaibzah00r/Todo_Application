const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: [true, "title already in DB"],
  },

  content: {
    type: String,
  },
  category: {
    type: String,
  },
  done: {
    type: Boolean,
    default: false,
  },
  currentDate: String,
  currentTime: String,

  users: { type: mongoose.Schema.Types.ObjectId, ref: "admins" },
});
const Users = mongoose.model("users", usersSchema);

module.exports = Users;
