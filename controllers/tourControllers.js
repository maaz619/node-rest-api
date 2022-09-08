const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { deleteOne } = require("./handleFactory");

//Get req to fetch all the tour

const getAllTour = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .limitingField()
    .sort()
    .pagination();
  const tours = await features.query;

  res.status(200).json({
    status: "success",
    result: tours.length,
    data: {
      tours,
    },
  });
});

//Get req to fetch tour stats

const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: "$difficulty",
        numTour: { $sum: 1 },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

//Get req to fetch busiest month of tours

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tour: { $push: "$name" },
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: { _id: 0 },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});

//Get req to fetch a single tour by Id

const getTourById = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ _id: req.params.id }).populate("reviews");
  //if no tour found it'll skip direct to our global error handler
  if (!tour) {
    return next(new AppError("No tour found with this ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

//Get req for top 5 tour

const topTour = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,difficulty,duration,summary,";
  next();
};

//Post req to create a new tour

const createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
});

//Patch req to update an existing tour

const updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  if (!tour) {
    return next(new AppError("No tour found with this ID"));
  }
  res.status(201).json({
    status: "success",
    data: {
      tour: tour,
    },
  });
});

//Delete req to delete an existing tour

const deleteTour = deleteOne(Tour);
//exporting all the above functions
module.exports = {
  getAllTour,
  getTourById,
  createTour,
  deleteTour,
  updateTour,
  topTour,
  getTourStats,
  getMonthlyPlan,
};
