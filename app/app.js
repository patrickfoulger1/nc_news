const express = require("express");
const { getEndpoints } = require("./Controllers/app.controller");
const { getTopics } = require("./Controllers/topics.controller");
const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
} = require("./Controllers/articles.controller");
const app = express();

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.use((error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ message: "Bad Request" });
  } else {
    next(error);
  }
});

app.use((error, request, response, next) => {
  if (error.status && error.message) {
    response.status(error.status).send({ message: error.message });
  } else {
    next(error);
  }
});

app.use((error, request, response, next) => {
  console.log(error);
  response.status(500).send({ message: "Internal Server Error" });
});

module.exports = app;
