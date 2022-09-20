const Review = require("../models/reviewModal");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handleFactory");

const getReviews = getAll(Review);
const setTourUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
const createReview = createOne(Review);
const updateReview = updateOne(Review);
const deleteReview = deleteOne(Review);
const getReview = getOne(Review);

module.exports = {
  getReviews,
  setTourUserId,
  createReview,
  deleteReview,
  updateReview,
  getReview,
};
