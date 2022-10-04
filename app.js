const express = require("express");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const rateLimit = require("express-rate-limit");
const rateSlow = require("express-slow-down");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// middleware
app.use(helmet());

app.use(cors({ origin: "http://localhost:3000" }));

//body parser
app.use(express.json({ limit: "10kb" }));

//data sanitization against NoSql query injection
app.use(mongoSanitize());
app.use(cookieParser());

//for static files
app.use(express.static(`${__dirname}/public}`));

//data sanitization
app.use(xssClean());

//preventing query pollution
app.use(hpp({ whitelist: ["duration", "difficulty", "price"] }));
// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});
//limit middleware

// const limiter = rateLimit({
//   max: 100,
//   windowMs: 3600000,
//   message: "too many request from same IP.",
// });
//slower middleware

// const slower = rateSlow({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   delayAfter: 10, // allow 100 requests per 15 minutes, then...
//   delayMs: 1000,
// });

// app.use("/api", limiter);

// routing

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find the ${req.originalUrl} in this server`));
});

app.use(globalErrorHandler);

module.exports = app;
