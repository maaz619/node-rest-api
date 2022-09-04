const express = require("express");
const {
  getAllUsers,
  getUser,
  updateUser,
  createUser,
  deleteMe,
  updateMe,
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
router.patch("/updateMe", protected, updateMe);
router.post("/forgotPassword", forgotPassword);
router.delete("/deleteMe", protected, deleteMe);

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser);

module.exports = router;
