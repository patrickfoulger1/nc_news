const express = require("express");
const { getEndpoints } = require("./Controllers/app.controller");
const { getTopics } = require("./Controllers/topics.controller");
const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postComment,
  patchArticle,
} = require("./Controllers/articles.controller");
const { deleteComment } = require("./Controllers/comments.controller");
const app = express();
app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);
app.patch("/api/articles/:article_id", patchArticle);
app.delete("/api/comments/:comment_id", deleteComment);

app.all("*", (request, response) => {
  response.status(404).send({ message: "Endpoint not found" });
});

app.use((error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ message: "Not a valid id" });
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
