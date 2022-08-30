const express = require("express");
const {
  getAllUsers,
  getUser,
  updateUser,
  createUser,
  deleteUser,
} = require("../controllers/userController");
const {
  signup,
  login,
  resetPassword,
  forgotPassword,
  protected,
  updatePassword,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.patch("/resetPassword/:token", resetPassword);
router.patch("/updatePassword", protected, updatePassword);
router.post("/forgotPassword", forgotPassword);

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
