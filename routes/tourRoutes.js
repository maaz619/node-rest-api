const express = require("express");
const tourController = require("../controllers/tourContollers");

const { getAllTour, postNewTour, getTourById, updateTourById, deleteTourById } =
  tourController;

const router = express.Router();

router
  .route("/:id")
  .get(getTourById)
  .patch(updateTourById)
  .delete(deleteTourById);

router.route("/").get(getAllTour).post(postNewTour);

module.exports = router;
