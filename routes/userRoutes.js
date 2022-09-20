const express = require("express");
const {
  getAllUsers,
  getUser,
  updateUser,
  createUser,
  deleteMe,
  updateMe,
  getMe,
} = require("../controllers/userController");
const {
  signup,
  login,
  resetPassword,
  forgotPassword,
  protected,
  updatePassword,
  restrictTo,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.patch("/resetPassword/:token", resetPassword);
router.post("/forgotPassword", forgotPassword);

router.use(protected);
router.get("/me", getMe, getUser);
router.patch("/updatePassword", updatePassword);
router.patch("/updateMe", updateMe);
router.delete("/deleteMe", deleteMe);

router.use(restrictTo("admin"));

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser);

module.exports = router;
