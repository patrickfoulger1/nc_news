const { getEndpoints } = require("../Controllers/app.controller");

const apiRouter = require("express").Router();
const topicsRouter = require("./topics.route");
const articlesRouter = require("./articles.route");
const commentsRouter = require("./comments.route");
const usersRouter = require("./users.route");

apiRouter.get("/", getEndpoints);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
