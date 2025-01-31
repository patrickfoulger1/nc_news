const { selectTopics, insertTopic } = require("../Models/topics.model");

exports.getTopics = async (request, response, next) => {
  try {
    const topics = await selectTopics();
    response.status(200).send({ topics });
  } catch (error) {
    next(error);
  }
};

exports.postTopics = async (request, response, next) => {
  try {
    const { body: postedTopic } = request;

    const topic = await insertTopic(postedTopic);
    response.status(201).send({ topic });
  } catch (error) {
    next(error);
  }
};
