const mongoose = require("mongoose");
const response = require("../helpers/response");
const Comment = require("../models/commentModel");

const newComment = async (req, res) => {
  req.body.author = req.user._id;

  try {
    let comment = await Comment.create(req.body);
    return res.status(200).json({
      message: "Successfully created comment",
      comment,
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

const getComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(400).json(response.failure("comment not found"));
    }

    return res.status(200).json({ comment });
  } catch (e) {
    return res.status(400).json(response.failure("Bad Comment ID"));
  }
};

const updateComment = async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(400).json(response.failure("comment not found"));
    }

    if (req.user._id !== comment.author.id) {
      return res.status(403).json(response.failure("Unauthorized access"));
    }

    delete req.body.post;
    delete req.body.author;

    comment.set(req.body);
    comment = await comment.save();

    return res.status(200).json({
      message: "Comment updated",
      comment,
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

const deleteComment = async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(400).json(response.failure("comment not found"));
    }

    if (req.user.role === "user" && req.user._id != comment.author.id) {
      return res.status(403).json(response.failure("Unauthorized access"));
    }

    comment = await comment.deleteOne();

    return res.status(200).json({
      message: "Success Delete",
      comment,
    });
  } catch (error) {
    return res.status(500).json(response.failure("Fail delete"));
  }
};

module.exports = {
  newComment,
  getComment,
  updateComment,
  deleteComment,
};
