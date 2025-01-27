const express = require("express");
const { getEndpoints } = require("./Controllers/app.controller");
const { getTopics } = require("./Controllers/topics.controller");
const app = express();

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);

app.use((error, request, response, next) => {
  if (error.status === "404") {
    response.status(404).send({ message: error.message });
  } else {
    next(error);
  }
});

app.use((error, request, response, next) => {
  console.log(error);
  response.status(500).send({ message: "Internal Server Error" });
});

module.exports = app;
