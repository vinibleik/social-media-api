const mongoose = require("mongoose");
const response = require("../helpers/response");
const Post = require("../models/postModel");

const postPermission = async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(400).json(response.failure("post not found"));
  }

  if (req.user._id == post.author || req.user.role === "admin") {
    req.post = post;
    return next();
  }

  return res.status(403).json(response.failure("Unauthorized access"));
};

const getPostsByAuthor = async (req, res) => {};

const getRelatedPosts = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json(response.failure("post not found"));
    }
    const limit = req.query.limit || 0;
    const skip = req.query.skip || 0;
    const relatedPosts = await post.getRelatedPosts(limit, skip);
    return res.status(200).json(response.success({ post, relatedPosts }));
  } catch (error) {
    return res.status(400).json(response.failure("Bad ID"));
  }
};

const newPost = async (req, res) => {
  if (req.body.author != req.user._id) {
    return res.status(400).json(response.failure("Authentication failed"));
  }
  req.body.votes = 0;
  try {
    let post = await Post.create(req.body);
    return res.status(200).json(
      response.success({
        message: "Successfully created user",
        post,
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

const getPost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id, "-__v");
    if (!post) {
      return res.status(400).json(response.failure("post not found"));
    }
    post = await post.populate("author", "name email _id");
    // let retPost = post.toObject();
    // delete retPost._id;
    // delete retPost.author._id;
    return res.status(200).json(
      response.success({
        post: post,
      })
    );
  } catch (error) {
    return res.status(400).json(response.failure("Bad Post ID"));
  }
};

const updatePost = async (req, res) => {
  try {
    let post = req.post;
    req.body.votes = post.votes;
    delete req.body.author;
    post.set(req.body);
    post = await post.save();
    return res.status(200).json({
      message: "Success update",
      post,
    });
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

const deletePost = async (req, res) => {
  try {
    const post = await req.post.deleteOne();
    return res.status(200).json(
      response.success({
        message: "Success delete",
        post,
      })
    );
  } catch (error) {
    return res.status(500).json(response.failure("Fail delete"));
  }
};

module.exports = {
  postPermission,
  getPostsByAuthor,
  getRelatedPosts,
  newPost,
  getPost,
  updatePost,
  deletePost,
};
