const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const DB = process.env.DB_LOCAL;

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

const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log(`App running on ${port}...`);
});
