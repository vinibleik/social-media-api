const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title required"],
      unique: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Posts can't be anonymous"],
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
      required: [true, "A post can't be empty"],
      maxLength: [500, "At max 500 characters per post"],
    },
    votes: {
      type: Number,
      default: 0,
    },
    themes: {
      type: [String],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

postSchema.methods.getRelatedPosts = async function (limit = 0, skip = 0) {
  return await mongoose
    .model("Post")
    .find({ themes: { $in: this.themes }, _id: { $ne: this._id } }, null, {
      limit: limit,
      skip: skip,
    })
    .populate("author", "name email");
};

postSchema.methods.getPeopleLiked = async function (limit = 0, skip = 0) {
  return await mongoose
    .model("User")
    .find({ likedPosts: this._id })
    .limit(limit)
    .skip(skip)
    .select("name email");
};

postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
});

module.exports = mongoose.model("Post", postSchema);
