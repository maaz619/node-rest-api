const express = require("express");
const userController = require("../controllers/userConroller");

const { getAllUsers, getUser, updateUser, createUser, deleteUser } =
  userController;
const router = express.Router();

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
