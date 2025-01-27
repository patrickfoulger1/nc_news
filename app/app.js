const express = require("express");
const { getEndpoints } = require("../Controllers/app.controllers");
const app = express();

app.get("/api", getEndpoints);

module.exports = app;
