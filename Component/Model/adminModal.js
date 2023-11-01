const mongoose = require("mongoose");

const mongoSchema = new mongoose.Schema({
  fName: {
    type: String,
    required: true,
  },
  lName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
  cPassword: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default:
      "https://media.wired.com/photos/598e35994ab8482c0d6946e0/master/w_1600,c_limit/phonepicutres-TA.jpg",
  },

  // users: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
});
const Admin = mongoose.model("admins", mongoSchema);

module.exports = Admin;
