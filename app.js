const fs = require("fs");
const express = require("express");
const res = require("express/lib/response");

const app = express();
const port = 9000;

// middleware
app.use(express.json());

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
app.route("/api/v1/tours").get(getAllTour).post(postNewTour);

app
  .route("/api/v1/tours/:id")
  .get(getTourById)
  .patch(updateTourById)
  .delete(deleteTourById);

app.listen(port, () => {
  console.log(`App running on ${port}...`);
});
