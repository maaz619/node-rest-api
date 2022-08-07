const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const validator = require("validator");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!!");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const DB = process.env.DB_LOCAL;

const connectDB = async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/tour-app", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  console.log("DB conn. successful");
};
connectDB();

const port = process.env.PORT || 9000;

const server = app.listen(port, () => {
  console.log(`App running on ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
console.log(validator.isEmail("some@gm.com"));
// console.log(x);
