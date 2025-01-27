const { selectTopics } = require("../Models/topics.model");

exports.getTopics = async (request, response, next) => {
  try {
    const topics = await selectTopics();
    response.status(200).send({ topics });
  } catch (error) {
    next(error);
  }
};
