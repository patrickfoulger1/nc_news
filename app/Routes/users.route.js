const {
  getUsers,
  getUserByUsername,
} = require("../Controllers/users.controller");

const usersRouter = require("express").Router();

usersRouter.get("/", getUsers);
usersRouter.get("/:username", getUserByUsername);

module.exports = usersRouter;
