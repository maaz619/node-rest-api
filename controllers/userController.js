const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});
const createUser = (req, res) => {
  res.status(500).json({
    status: "err",
    message: "route not define yet",
  });
};
const getUser = (req, res) => {
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
const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new AppError("No user find with this Id!!", 404));
  res.status(200).json({
    status: "success",
    data: null,
  });
});

module.exports = { getAllUsers, createUser, getUser, updateUser, deleteUser };
