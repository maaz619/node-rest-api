const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("No document found with this ID"));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .limitingField()
      .sort()
      .pagination();
    const doc = await features.query;

    res.status(200).json({
      status: "success",
      result: doc.length,
      data: {
        doc,
      },
    });
  });

const getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions)
      query = Model.findById(req.params.id).populate(populateOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError("No document found with this ID"));
    }
    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });
    if (!doc) {
      return next(new AppError("No tour found with this ID"));
    }
    res.status(201).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        doc,
      },
    });
  });
module.exports = { deleteOne, updateOne, getOne, createOne, getAll };
