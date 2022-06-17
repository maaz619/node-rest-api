const fs = require("fs");
const express = require("express");

const app = express();
const port = 9000;

// middleware
app.use(express.json());

app.use((req, res, next) => {
  req.time = new Date().toISOString();
  next();
});
// middleware

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/tours.json`));

const getAllTour = (req, res) => {
  res.status(200).json({
    status: "success",
    result: tours.length,
    data: {
      tours: tours,
    },
  });
};
const postNewTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/tours.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tours: newTour,
        },
      });
    }
  );
};

const getTourById = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) res.status(401).json({ status: "Fail", message: "Invalid Id" });
  res.status(200).json({
    status: "success",
    message: tour,
    time: req.time,
  });
};
const updateTourById = (req, res) => {
  if (req.params.id * 1 > tours.length)
    res.status(404).json({ status: "Fail", message: "Invalid Id" });
  res.status(200).json({
    status: "success",
    message: "updated tour .....",
  });
};

const deleteTourById = (req, res) => {
  if (req.params.id * 1 > tours.length)
    res.status(404).json({ status: "Fail", message: "Invalid Id" });
  res.status(204).json({
    status: "success",
    data: null,
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: "err",
    message: "route not define yet",
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: "err",
    message: "route not define yet",
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: "err",
    message: "route not define yet",
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: "err",
    message: "route not define yet",
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: "err",
    message: "route not define yet",
  });
};

// routing

const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route("/").get(getAllTour).post(postNewTour);

tourRouter
  .route("/:id")
  .get(getTourById)
  .patch(updateTourById)
  .delete(deleteTourById);

userRouter.route("/").get(getAllUsers).post(createUser);
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.listen(port, () => {
  console.log(`App running on ${port}...`);
});
