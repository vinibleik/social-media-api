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

const likePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json(response.failure("post not found"));
    } else if (post.author == req.user._id) {
      return res
        .status(400)
        .json(response.failure("Can't like your own post!"));
    }

    let user = await mongoose.model("User").findById(req.user._id);

    const containPost = user.likedPosts.indexOf(post._id);
    let inc = 0;
    if (containPost === -1) {
      user.likedPosts.push(post._id);
      inc = 1;
    } else {
      user.likedPosts.splice(containPost, 1);
      inc = -1;
    }
    await post.updateOne({ $inc: { votes: inc } }, { new: true });
    await user.save();
    return res.status(200).json(
      response.success({
        votes: post.votes + inc,
      })
    );
  } catch (e) {
    return res.status(500).json(response.failure("Server Error"));
  }
};

const getLikes = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json(response.failure("post not found"));
    }
    // const limit = parseInt(req.query.limit) || 5;
    // const skip = parseInt(req.query.skip) || 0;
    const likes = await post.getPeopleLiked(req.query.limit, req.query.skip);
    return res.status(200).json(response.success({ post, likes }));
  } catch (error) {
    return res.status(400).json(response.failure("Bad Post ID"));
  }
};

const getRelatedPosts = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json(response.failure("post not found"));
    }
    // const limit = parseInt(req.query.limit) || 5;
    // const skip = parseInt(req.query.skip) || 0;
    const relatedPosts = await post.getRelatedPosts(
      req.query.limit,
      req.query.skip
    );
    return res.status(200).json(response.success({ post, relatedPosts }));
  } catch (error) {
    return res.status(400).json(response.failure("Bad Post ID"));
  }
};

const getPostComments = async (req, res) => {
  try {
    let comments = await mongoose
      .model("Comment")
      .find({ post: req.params.id }, "-__v", {
        limit: /*parseInt(req.query.limit) || 5*/ req.query.limit,
        skip: /*parseInt(req.query.skip) || 0*/ req.query.skip,
      })
      .populate("author", "name");

    return res.status(200).json(
      response.success({
        comments,
      })
    );
  } catch (error) {
    console.log(error);
    return res.status(400).json(response.failure("Bad Post ID"));
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
        message: "Successfully created Post",
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
    let post = await Post.findById(req.params.id, "-__v")
      .populate("author", "name email")
      .populate({
        path: "comments",
        select: "-__v",
        perDocumentLimit: parseInt(req.query.comLimit) || 5,
        populate: {
          path: "author",
          select: "name email",
        },
      });
    if (!post) {
      return res.status(400).json(response.failure("post not found"));
    }
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
  getRelatedPosts,
  getPostComments,
  newPost,
  getPost,
  updatePost,
  deletePost,
  likePost,
  getLikes,
};
