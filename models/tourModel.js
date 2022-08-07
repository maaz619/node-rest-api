const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
      trim: true,
      maxlength: [40, "Tour name should not exceed 40 character"],
      minlength: [10, "Tour name should be minimum 10 character"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return this.price > val;
        },
        message: "Discount price must be less than regular price",
      },
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "Duration is required"],
    },
    difficulty: {
      type: String,
      required: [true, "Name is required"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "difficulty should be either of one: easy, medium, difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "Summary is required"],
    },
    description: {
      type: String,
      trim: true,
      // required: [true, "Desc. is required"],
    },
    imageCover: {
      type: String,
      required: [true, "Cover image is required"],
    },
    image: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);
//Documents middleware only runs before and after .save() and .create()
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
//Query middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});
//Aggregation middleware
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});
const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
