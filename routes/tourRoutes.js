const express = require("express");
const tourController = require("../controllers/tourContollers");

const { getAllTour, topTour, createTour, deleteTour, getTourById, updateTour } =
  tourController;

const router = express.Router();

router.route("/top-tour").get(topTour, getAllTour);

router.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);

router.route("/").get(getAllTour).post(createTour);

module.exports = router;
