const express = require("express");
const tourController = require("../controllers/tourContollers");
const { protected, restrictTo } = require("../controllers/authController");

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

router.route("/").get(protected, getAllTour).post(createTour);

router.route("/tour-stats").get(getTourStats);

router.route("/monthly-plan/:year").get(getMonthlyPlan);

router.route("/top-tour").get(topTour, getAllTour);

router
  .route("/:id")
  .get(getTourById)
  .patch(updateTour)
  .delete(protected, restrictTo("admin", "lead-guide"), deleteTour);

module.exports = router;
