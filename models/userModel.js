const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { randomBytes, createHash } = require("crypto");
const res = require("express/lib/response");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is require"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: [validator.isEmail, "Please use a valid email"],
  },
  role: {
    type: String,
    enum: ["admin", "user", "guide", "lead-guide"],
    default: "user",
  },
  photo: String,
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password should be same!!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next;
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.methods.correctPassword = async function (
  providedPassword,
  userPassword
) {
  return await bcrypt.compare(providedPassword, userPassword);
};
userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  const changeTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
  if (changeTimeStamp) {
    console.log(changeTimeStamp, JWTTimestamp);
    return JWTTimestamp < changeTimeStamp;
  }
  return false;
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = randomBytes(32).toString("hex");
  this.passwordResetToken = createHash("sha256", resetToken).digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60000;
  console.log({ resetToken }, this.passwordResetToken);
  return resetToken;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
