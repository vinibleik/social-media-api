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
        message: `"{VALUE}" is not a valid role`,
      },
      default: "user",
    },
    name: String,
    age: Number,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
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
