const endpoints = require("../endpoints.json");

exports.getEndpoints = async (request, response, next) => {
  try {
    response.status(200).send({ endpoints });
  } catch (error) {
    next(error);
  }
};
