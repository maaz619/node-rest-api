const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { getOne, getAll } = require("./handleFactory");

const filterObj = (obj, ...allowFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const getAllUsers = getAll(User);

const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

const getUser = getOne(User);

const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updating. please use /updatePassword",
        400
      )
    );
  }
  const filtered = filterObj(req.body, "name", "email", "active");
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filtered, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: { user: updatedUser },
  });
});

const createUser = (req, res) => {
  res.status(500).json({
    status: "err",
    message: "route not define yet",
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: "err",
    message: "route not define yet",
  });
};
const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  getAllUsers,
  updateMe,
  createUser,
  getUser,
  updateUser,
  deleteMe,
  getMe,
};
