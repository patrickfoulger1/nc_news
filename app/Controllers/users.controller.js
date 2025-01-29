const { selectUsers } = require("../Models/users.model");

exports.getUsers = async (request, response, next) => {
  try {
    const users = await selectUsers();
    response.status(200).send({ users });
  } catch (error) {
    next(error);
  }
};
