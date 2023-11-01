const multer = require("multer");
require("dotenv").configDotenv();

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");

module.exports = upload;
