const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const { promisify } = require("util");
const { sendEmail } = require("../utils/email");
const crypto = require("crypto");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookiesOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 3600000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookiesOptions.secure = true;
  res.cookie("jwt", token, cookiesOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    // passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });
  createSendToken(newUser, 201, res);
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
  createSendToken(user, 200, res);
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
  currentUser.passwordChangedAt && currentUser.changePasswordAfter(decoded.iat)
    ? next(new AppError("User has changed password!! Please login again", 401))
    : null;

  req.user = currentUser;
  req.thisUser = currentUser;
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    //
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You don't have permission!!", 403));
    }
    next();
  };
};
const forgotPassword = catchAsync(async (req, res, next) => {
  //get user
  const user = await User.findOne({ email: req.body.email });
  !user ? next(new AppError("There is no user with this email!!", 404)) : null;

  // generate random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // send email

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = ` Please follow the link to reset your password: ${resetURL}.\n If you didn't do this please report!!`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your token is valid for only 10 min.",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Reset link has been sent to your email.",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(error.message);
    return next(
      new AppError(
        "There was an error sending the email. Please try again later.",
        500
      )
    );
  }
});
const resetPassword = catchAsync(async (req, res, next) => {
  //getting token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //if no user or expired token
  if (!user) return next(new AppError("Token is invalid or expire", 400));
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // if password expired
  //Login the user
  createSendToken(user, 200, res);
});
const updatePassword = catchAsync(async (req, res, next) => {
  //get the user
  const user = await User.findById(req.user.id).select("+password");
  //check old password
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("You current password is invalid", 401));
  }
  if (req.body.passwordCurrent === req.body.password)
    return next(
      new AppError("New password cannot be same as you old password", 400)
    );
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});
module.exports = {
  signup,
  login,
  protected,
  restrictTo,
  resetPassword,
  forgotPassword,
  updatePassword,
};
