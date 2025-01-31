const { request, response } = require("express");
const {
  selectArticleById,
  selectArticles,
  modifyArticles,
  selectCommentsByArticleId,
  insertComment,
  updateArticle,
  appendArticleCommentCount,
  insertArticle,
} = require("../Models/articles.model");
const { checkArticleExists } = require("../utils/checkArticleExists");
const { checkIfValidId } = require("../utils/checkIfValidId");

exports.getArticles = async (request, response, next) => {
  try {
    const { query } = request;
    const { articles, total_count } = await selectArticles(query);
    const modifiedArticles = await modifyArticles(articles);
    response.status(200).send({ articles: modifiedArticles, total_count });
  } catch (error) {
    next(error);
  }
};

exports.getArticleById = async (request, response, next) => {
  try {
    const {
      params: { article_id },
    } = request;
    await checkArticleExists(article_id);
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
    await checkArticleExists(article_id);
    await checkIfValidId(article_id);
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
    await checkArticleExists(article_id);
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
    await checkArticleExists(article_id);
    const updatedArticle = await updateArticle(article_id, inc_votes);
    response.status(200).send({ article: updatedArticle });
  } catch (error) {
    next(error);
  }
};

exports.postArticle = async (request, response, next) => {
  try {
    const { body: postArticle } = request;
    const article = await insertArticle(postArticle);
    response.status(201).send({ article });
  } catch (error) {
    next(error);
  }
};
