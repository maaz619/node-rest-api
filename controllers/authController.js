const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const { promisify } = require("util");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });
  const token = signToken(User._id);
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password"), 400);
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password"), 400);
  }
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});
const protected = catchAsync(async (req, res, next) => {
  // checking if getting token or not
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return next(new AppError("Unauthorized access!!", 401));
  //token verification
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_PRIVATE_KEY
  );
  console.log(decoded);
  // check for user exist or not
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(new AppError("User to this token doesn't exist!!", 401));

  //check for password changed for provided token
  currentUser.changePasswordAfter(decoded.iat)
    ? next(new AppError("User has changed password!! Please login again", 401))
    : null;

  req.user = currentUser;
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    //
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You don't have permission!!", 403));
    }
  };
};
module.exports = { signup, login, protected, restrictTo };
