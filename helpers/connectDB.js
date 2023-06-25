const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const User = require("../models/userModel");
    // await User.deleteMany({});

    console.log("Database connected successfully");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
