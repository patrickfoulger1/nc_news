const {
  selectArticleById,
  selectArticles,
  modifyArticles,
  selectCommentsByArticleId,
  insertComment,
  updateArticle,
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

exports.getCommentsByArticleId = async (request, response, next) => {
  try {
    const {
      params: { article_id },
    } = request;
    const comments = await selectCommentsByArticleId(article_id);
    response.status(200).send({ comments });
  } catch (error) {
    next(error);
  }
};

exports.postComment = async (request, response, next) => {
  try {
    const {
      params: { article_id },
      body: comment,
    } = request;

    const postedComment = await insertComment(article_id, comment);
    response.status(201).send({ comment: postedComment });
  } catch (error) {
    next(error);
  }
};

exports.patchArticle = async (request, response, next) => {
  try {
    const {
      params: { article_id },
      body: { inc_votes },
    } = request;
    const updatedArticle = await updateArticle(article_id, inc_votes);
    response.status(200).send({ article: updatedArticle });
  } catch (error) {
    next(error);
  }
};
