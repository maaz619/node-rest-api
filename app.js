const express = require("express");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// middleware
app.use(express.json());

app.use((req, res, next) => {
  req.time = new Date().toISOString();
  next();
});
// middleware

// routing

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
