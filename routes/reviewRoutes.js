const { Router } = require("express");
const { protected, restrictTo } = require("../controllers/authController");
const {
  getReviews,
  getReview,
  createReview,
  deleteReview,
  updateReview,
  setTourUserId,
} = require("../controllers/reviewController");

const router = Router({ mergeParams: true });

router.use(protected);
router
  .route("/")
  .get(getReviews)
  .post(restrictTo("user"), setTourUserId, createReview);
router
  .route("/:id")
  .get(getReview)
  .patch(restrictTo("admin", "user"), updateReview)
  .delete(restrictTo("admin", "user"), deleteReview);

module.exports = router;
