const catchAsync = require("../utils/catchAsync");
const Review = require("../models/reviewModal");
const { deleteOne } = require("./handleFactory");

const getReview = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const review = await Review.find(filter);
  await res.status(200).json({
    status: "success",
    review,
  });
});
const createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const review = await Review.create(req.body);
  res.status(201).json({
    status: "success",
    review,
  });
});
const deleteReview = deleteOne(Review);

module.exports = { getReview, createReview, deleteReview };
