const express = require("express");

const apiRouter = require("./Routes/api.route");
const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.all("*", (request, response) => {
  response.status(404).send({ message: "Endpoint not found" });
});

app.use((error, request, response, next) => {
  if (error.code === "22P02") {
    response
      .status(400)
      .send({ message: "Bad Request: Invalid Text Representation" });
  } else if (error.code === "23502") {
    response.status(400).send({ message: "Bad Request: NOT NULL VIOLATION" });
  } else if (error.code === "23503") {
    response
      .status(400)
      .send({ message: "Bad Request: Foreign key violation" });
  } else {
    next(error);
  }
});

app.use((error, request, response, next) => {
  if (error.status && error.message) {
    response.status(error.status).send({ message: error.message });
  } else {
    next(error);
  }
});

app.use((error, request, response, next) => {
  console.log(error);
  response.status(500).send({ message: "Internal Server Error" });
});

module.exports = app;
