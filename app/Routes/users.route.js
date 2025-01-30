const { getUsers } = require("../Controllers/users.controller");

const usersRouter = require("express").Router();

usersRouter.get("/", getUsers);

module.exports = usersRouter;
