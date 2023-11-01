const express = require("express");
const cloudnary = require("cloudinary").v2;
const app = express();
require("dotenv").configDotenv();
const cors = require("cors");
app.use(cors(), express.json());
require("./Utils/conn");
const userRouter = require("./Routes/usersRoutes");
const registerRoutes = require("./Routes/registerRoutes");
const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server running no: ${PORT}`));

cloudnary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.use("/users", userRouter);
app.use("/", registerRoutes);
