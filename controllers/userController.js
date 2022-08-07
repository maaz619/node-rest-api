const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(500).json({
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
const deleteUser = (req, res) => {
  res.status(500).json({
    status: "err",
    message: "route not define yet",
  });
};

module.exports = { getAllUsers, createUser, getUser, updateUser, deleteUser };
