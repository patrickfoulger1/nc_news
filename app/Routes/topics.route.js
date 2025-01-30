const { getTopics } = require("../Controllers/topics.controller");

const topicsRouter = require("express").Router();

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
