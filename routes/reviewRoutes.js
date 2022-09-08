const { Router } = require("express");
const { protected } = require("../controllers/authController");
const {
  getReview,
  createReview,
  deleteReview,
} = require("../controllers/reviewController");

const router = Router({ mergeParams: true });

router.route("/").get(protected, getReview).post(protected, createReview);
router.route("/:id").delete(protected, deleteReview);

module.exports = router;
