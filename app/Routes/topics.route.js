const { getTopics, postTopics } = require("../Controllers/topics.controller");

const topicsRouter = require("express").Router();

topicsRouter.get("/", getTopics);
topicsRouter.post("/", postTopics);

module.exports = topicsRouter;
