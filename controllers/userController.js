const mongoose = require("mongoose");
const User = require("../models/userModel");
const response = require("../helpers/response");

const userPermission = async (req, res, next) => {
  if (req.user._id == req.params.id || req.user.role === "admin") {
    return next();
  }

  return res.status(403).json(response.failure("Unauthorized access"));
};

const getUserById = async (req, res) => {
  try {
    let user = await User.findById(req.params.id, "-__v -password -likedPosts");
    if (!user) {
      return res.status(400).json(response.failure("user not found"));
    }

    if (req.query.posts === "true") {
      var posts = await mongoose
        .model("Post")
        .find({ author: user._id }, "-__v", {
          limit: parseInt(req.query.pLimit) || 5,
          skip: parseInt(req.query.pSkip) || 0,
        })
        .populate({
          path: "comments",
          select: "-__v",
          perDocumentLimit: parseInt(req.query.comLimit) || 5,
          populate: {
            path: "author",
            select: "name id",
          },
        });

      user = {
        user,
        posts,
      };
    }

    return res.status(200).json(response.success(user));
  } catch (error) {
    return res.status(400).json(response.failure("Bad ID"));
  }
};

const getUserByEmail = async (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).json(response.failure("email required"));
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json(response.failure("user not found"));
    }
    return res.status(200).json(
      response.success({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
      })
    );
  } catch (error) {
    return res.status(400).json(response.failure("Bad email"));
  }
};

const getUserLikes = async (req, res) => {
  try {
    let user = await User.findById(req.params.id, "-__v -password");
    if (!user) {
      return res.status(400).json(response.failure("user not found"));
    }

    const limit = parseInt(req.query.limit) || 5;
    const skip = parseInt(req.query.skip) || 0;

    const likedPosts = await user.getLikedPosts(limit, skip);

    return res.status(200).json(response.success({ user, likedPosts }));
  } catch (error) {
    console.log(error);
    return res.status(400).json(response.failure("Bad User ID"));
  }
};

const updateUser = async (req, res) => {
  const { role } = req.body;

  if (role === "admin" && req.user.role !== "admin") {
    return res
      .status(400)
      .json(response.failure("Just admins can create another admins!"));
  }

  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json(response.failure("user not found"));
    }

    user.set(req.body);
    user = await user.save();
    return res.status(200).json(
      response.success({
        message: "Success update",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          age: user.age,
        },
      })
    );
  } catch (e) {
    let errMsg = "";
    if (e instanceof mongoose.mongo.MongoError) {
      errMsg = Object.keys(e.keyValue).join(",") + " already exists!";
    } else {
      errMsg = Object.entries(e.errors).at(0)[1].message;
    }
    return res.status(400).json(response.failure(errMsg));
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(400).json(response.failure("user not found"));
    }
    return res.status(200).json(
      response.success({
        message: "Success delete",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          age: user.age,
        },
      })
    );
  } catch (error) {
    return res.status(500).json(response.failure("Fail delete"));
  }
};

const getPosts = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json(response.failure("user not found"));
    }

    const posts = await mongoose
      .model("Post")
      .find({ author: user._id }, "-__v", {
        limit: parseInt(req.query.pLimit) || 10,
        skip: parseInt(req.query.pSkip) || 0,
      })
      .populate({
        path: "comments",
        select: "-__v",
        perDocumentLimit: parseInt(req.query.comLimit) || 5,
        populate: {
          path: "author",
          select: "name id",
        },
      });

    return res.status(200).json(
      response.success({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          age: user.age,
        },
        posts: posts,
      })
    );
  } catch (error) {
    return res.status(400).json(response.failure("Bad ID"));
  }
};

module.exports = {
  getUserById,
  getPosts,
  getUserByEmail,
  getUserLikes,
  userPermission,
  updateUser,
  deleteUser,
};
