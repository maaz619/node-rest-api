const mongoose = require("mongoose");
const Tour = require("./tourModel");

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "Review is require"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: "Tour",
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name photo" });
  next();
});
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  stats.length > 0
    ? await Tour.findByIdAndUpdate(tourId, {
        ratingsAverage: stats[0]?.avgRating,
        ratingsQuantity: stats[0]?.nRating,
      })
    : await Tour.findByIdAndUpdate(tourId, {
        ratingsAverage: 4.5,
        ratingsQuantity: 0,
      });
};
reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.tour);
});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
