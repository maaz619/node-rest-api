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

router.route("/").get(protected, getAllTour).post(protected, createTour);

router.route("/tour-stats").get(protected, getTourStats);

router.route("/monthly-plan/:year").get(protected, getMonthlyPlan);

router.route("/top-tour").get(topTour, protected, getAllTour);

router
  .route("/:id")
  .get(getTourById)
  .patch(updateTour)
  .delete(protected, restrictTo("admin", "lead-guide"), deleteTour);

module.exports = router;
