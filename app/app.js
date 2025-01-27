const express = require("express");
const { getEndpoints } = require("../Controllers/app.controllers");
const app = express();

app.get("/api", getEndpoints);

app.use((error, request, response, next) => {
  console.log(error);
  response.status(500).send({ message: "Internal Server Error" });
});

module.exports = app;
