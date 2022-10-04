const express = require("express");
const tourController = require("../controllers/tourControllers");
const { protected, restrictTo } = require("../controllers/authController");
const reviewRouter = require("../routes/reviewRoutes");

const {
  getAllTour,
  topTour,
  createTour,
  deleteTour,
  getTourById,
  updateTour,
  getTourStats,
  getMonthlyPlan,
} = tourController;

const router = express.Router();

router.use("/:tourId/review", reviewRouter);

router
  .route("/")
  .get(getAllTour)
  .post(protected, restrictTo("admin", "lead-guide"), createTour);

router.route("/tour-stats").get(protected, getTourStats);

router
  .route("/monthly-plan/:year")
  .get(protected, restrictTo("admin", "lead-guide", "guide"), getMonthlyPlan);

router.route("/top-tour").get(topTour, protected, getAllTour);
router.use(protected);
router
  .route("/:id")
  .get(getTourById)
  .patch(restrictTo("admin", "lead-guide"), updateTour)
  .delete(restrictTo("admin", "lead-guide"), deleteTour);

module.exports = router;
