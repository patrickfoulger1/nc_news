const db = require("../../db/connection.js");
const { checkArticleExists } = require("../utils/checkArticleExists.js");
const { checkTopicExists } = require("../utils/checkIfTopicExists.js");
const { checkIfValidId } = require("../utils/checkIfValidId.js");
const { getKeyString } = require("../utils/format.js");

exports.selectArticles = async ({ sort_by, order, topic }) => {
  sort_by ??= "created_at";
  order ??= "desc";

  if (topic) {
    await checkTopicExists(topic);
  }

  sort_by = sort_by.toLowerCase();
  order = order.toLowerCase();

  let articleSql = `
    SELECT * FROM articles 
    `;
  let articleSqlArgs = [];
  const expectedSorts = [
    "title",
    "author",
    "article_id",
    "created_at",
    "votes",
    "article_img_url",
  ];

  const expectedOrders = ["asc", "ascending", "desc", "descending"];

  if (topic) {
    articleSql += `WHERE topic = $1 `;
    articleSqlArgs.push(topic);
  }

  if (expectedSorts.includes(sort_by)) {
    articleSql += `ORDER BY ${sort_by} `;
  } else {
    return Promise.reject({
      status: 400,
      message: `Bad Request: ${sort_by} is an invalid query`,
    });
  }

  if (expectedOrders.includes(order)) {
    if (order === "ascending") order = "ASC";
    if (order === "descending") order = "DESC";
    articleSql += order;
  } else {
    return Promise.reject({
      status: 400,
      message: `Bad Request: ${order} is an invalid query`,
    });
  }

  const { rows: articles, rowCount } = await db.query(
    articleSql,
    articleSqlArgs
  );

  return articles;
};

exports.modifyArticles = async (articles) => {
  const updatedArticles = await appendArticlesCommentCount(articles);

  return removeArticlesBody(updatedArticles);
};

appendArticlesCommentCount = async (articles) => {
  const commentSql = `
    SELECT article_id, COUNT(article_id) FROM COMMENTS 
    GROUP BY article_id
    `;
  const { rows: commentCounts } = await db.query(commentSql);

  const commentCountMap = new Map();
  commentCounts.forEach(({ article_id, count }) => {
    commentCountMap.set(article_id, Number(count));
  });

  return articles.map((originalArticle) => {
    const article = { ...originalArticle };
    const { article_id } = article;
    if (commentCountMap.has(article_id)) {
      article.comment_count = commentCountMap.get(article_id);
    } else {
      article.comment_count = 0;
    }

    return article;
  });
};

exports.appendArticleCommentCount = async (originalArticle) => {
  const article = { ...originalArticle };
  let commentCount = 0;
  const commentSql = `
  SELECT  COUNT(article_id) FROM comments 
  WHERE article_id = $1
  GROUP BY article_id;`;

  const { rows: articles, rowCount } = await db.query(commentSql, [
    article.article_id,
  ]);

  if (rowCount > 0) {
    commentCount = Number(articles[0].count);
  }

  article.comment_count = commentCount;

  return article;
};
removeArticlesBody = (articles) => {
  return articles.map((originalArticle) => {
    const article = { ...originalArticle };
    delete article.body;

    return article;
  });
};

exports.selectArticleById = async (article_id) => {
  await checkArticleExists(article_id);
  const articleSql = `
  SELECT * FROM articles
  WHERE article_id = $1
  `;

  const { rows: articles, rowCount } = await db.query(articleSql, [article_id]);

  return articles[0];
};

exports.selectCommentsByArticleId = async (article_id) => {
  const commentSql = `
  SELECT * FROM comments
  WHERE article_id = $1
  ORDER BY created_at DESC
  `;

  const { rows: comments, rowCount } = await db.query(commentSql, [article_id]);

  return comments;
};

exports.insertComment = async (article_id, comment) => {
  const insertCommentSql = `
    INSERT INTO comments(author, body, article_id,  votes)
    VALUES($1, $2, $3, 0)
    RETURNING *
  `;
  const commentValues = [];
  const missingKeys = [];

  const expectedKeys = ["username", "body"];

  for (const key of expectedKeys) {
    if (comment[key]) {
      commentValues.push(comment[key]);
    } else {
      missingKeys.push(key);
    }
  }
  if (missingKeys.length > 0) {
    return Promise.reject({
      status: 400,
      message: `Comment is missing ${getKeyString(missingKeys)}`,
    });
  } else {
    commentValues.push(article_id);
    const { rows: comments } = await db.query(insertCommentSql, commentValues);
    return comments[0];
  }
};

exports.updateArticle = async (article_id, inc_votes) => {
  const updateArticleSql = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *
    `;

  const { rows: updates, rowCount } = await db.query(updateArticleSql, [
    inc_votes,
    article_id,
  ]);

  return updates[0];
};
