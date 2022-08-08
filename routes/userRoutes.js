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
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.patch("/resetpassword/:token", forgotPassword);
router.post("/forgotPassword", forgotPassword);

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
