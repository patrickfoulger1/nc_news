const { selectArticleById } = require("../Models/articles.model");

exports.getArticleById = async (request, response, next) => {
  try {
    const {
      params: { article_id },
    } = request;
    const article = await selectArticleById(article_id);
    response.status(200).send({ article });
  } catch (error) {
    next(error);
  }
};
