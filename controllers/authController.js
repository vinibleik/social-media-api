const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const response = require("../helpers/response");

const signup = async (req, res) => {
  try {
    const { id, email, name, age } = await User.create(req.body);
  } catch (error) {
    let errMsg = "";
    if (e instanceof mongoose.mongo.MongoError) {
      errMsg = Object.keys(e.keyValue).join(",") + " already exists!";
    } else {
      errMsg = Object.entries(e.errors).at(0)[1].message;
    }
    return res.status(400).json(response.failure(errMsg));
  }

  return res.status(200).json(
    response.success({
      message: "Successfully created user",
      user: { id, email, name, age },
    })
  );
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json(response.failure("this email doesn't exists"));
  }

  const match = await user.checkPassword(password);

  if (!match) {
    return res.status(401).json(response.failure("Invalid password"));
  }

  try {
    const token = jwt.sign({ _id: user.id, role: user.role }, "mySecretKey", {
      expiresIn: "30m",
    });
  } catch (error) {
    return res.status(500).json(response.failure("Token creation Error"));
  }

  return res
    .status(200)
    .json(response.success({ token, user: { id: user.id } }));
};

const verify = (req, res, next) => {
  const header = req.headers["authorization"];

  if (!header) {
    return res.status(401).json(response.failure("Unauthorized access"));
  }

  const token = header.split(" ")[1];

  if (!token) {
    return res.status(401).json(response.failure("Unauthorized access"));
  }

  try {
    const user = jwt.verify(token, "mySecretKey");
    req.user = user;
  } catch (error) {
    return res.status(401).json(response.failure("Invalid Token"));
  }

  next();
};

module.exports = {
  signup,
  login,
  verify,
};
