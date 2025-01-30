const { request, response } = require("../app");
const { selectUsers, selectUserByUsername } = require("../Models/users.model");

exports.getUsers = async (request, response, next) => {
  try {
    const users = await selectUsers();
    response.status(200).send({ users });
  } catch (error) {
    next(error);
  }
};

exports.getUserByUsername = async (request, response, next) => {
  try {
    const {
      params: { username },
    } = request;
    const user = await selectUserByUsername(username);
    response.status(200).send({ user });
  } catch (error) {
    next(error);
  }
};
