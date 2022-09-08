const mongoose = require("mongoose");
const fs = require("fs");
const Tour = require("../models/tourModel");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/tour-app", {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("DB conn. successful");
  } catch (err) {
    console.log(err);
  }
};
connectDB();
const tours = JSON.parse(fs.readFileSync(`${__dirname}/allTours.json`));
const migrateData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data migrated successfully");
  } catch (error) {
    console.log(err);
  }
  process.exit();
};
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data deleted successfully");
  } catch (error) {
    console.log(err);
  }
  process.exit();
};
console.log(process.argv);
if (process.argv[2] === "--migrate") migrateData();
else if (process.argv[2] === "--delete") deleteData();
