const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
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

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
