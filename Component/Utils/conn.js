const mongoose = require("mongoose");
const url = process.env.MONGO_URL;

const conn = mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUNifiedTopology: true,
  })
  .then(() => console.log("Conected_with_MONGODB"))
  .catch((err) => {
    console.log("error in conection", err);
  });

module.exports = conn;
