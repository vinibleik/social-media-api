const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Comments must be part of a Post"],
      validate: {
        validator: async function (id) {
          const post = await mongoose.model("Post").findById(id);
          return !!post;
        },
        message: "Post does not exist!",
      },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Comments can't be anonymous"],
      validate: {
        validator: async function (id) {
          const user = await mongoose.model("User").findById(id);
          return !!user;
        },
        message: "User does not exist!",
      },
    },
    body: {
      type: String,
      maxLength: [100, "At maximum 100 characters per comment"],
      required: [true, "Comments can't be empty"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

commentSchema.pre("findOne", function (next) {
  this.populate("author", "name email").select("-__v");
  next();
});

module.exports = mongoose.model("Comment", commentSchema);
