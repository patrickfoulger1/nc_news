const endpoints = require("../../endpoints.json");

exports.getEndpoints = (request, response, next) => {
  try {
    response.status(200).send({ endpoints });
  } catch (error) {
    next(error);
  }
};
