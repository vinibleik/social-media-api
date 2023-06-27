const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "email required"],
      unique: true,
    },
    password: {
      type: String,
      minLength: [8, "password must be at least 8 characters"],
      required: [true, "password required"],
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "'{VALUE}' is not a valid role",
      },
      default: "user",
    },
    name: {
      type: String,
      default: "",
    },
    age: {
      type: Number,
      default: 0,
      set: (v) => (!v || v < 0 ? 0 : v),
    },
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        validate: {
          validator: async function (id) {
            const post = await mongoose.model("Post").findById(id);
            return !!post;
          },
          message: "This Post ID does not exist!",
        },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

userSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getLikedPosts = async function (limit, skip) {
  return await mongoose
    .model("Post")
    .find({ _id: { $in: this.likedPosts } })
    .limit(limit)
    .skip(skip)
    .select("-__v");
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(this.password, salt);
      this.password = hashPassword;
    } catch (error) {
      return next(error);
    }
  }

  if (!this.name) {
    this.name = this.email;
  }

  return next();
});

userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "author",
});

userSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "author",
});

module.exports = mongoose.model("User", userSchema);
