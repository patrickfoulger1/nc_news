const {
  selectArticleById,
  selectArticles,
  modifyArticles,
} = require("../Models/articles.model");

exports.getArticles = async (request, response, next) => {
  try {
    const articles = await selectArticles();
    const modiedArticles = await modifyArticles(articles);
    response.status(200).send({ articles: modiedArticles });
  } catch (error) {
    next(error);
  }
};

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
