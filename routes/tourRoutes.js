const express = require("express");
const tourController = require("../controllers/tourContollers");

const { getAllTour, createTour, deleteTour, getTourById, updateTour } =
  tourController;

const router = express.Router();

// router.param("id", checkID);

router.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);

router.route("/").get(getAllTour).post(createTour);

module.exports = router;
