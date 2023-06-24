const express = require("express");
const Response = require("./helpers/response");
const connectDB = require("./helpers/connect_db");
require("dotenv").config();

connectDB();

const PORT = parseInt(process.env.PORT) || 5500;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Unavailable routes
 */
app.use("/", (req, res) => {
  return res
    .status(404)
    .json(Response.failure(`Can not get the url "${req.url}"`));
});

/**
 * Turning on the server
 */
app.listen(PORT, () => {
  console.log(`Sever listening on port ${PORT}`);
});
