const db = require("../../db/connection.js");
const { checkArticleExists } = require("../utils/checkArticleExists.js");
const { checkIfValidId } = require("../utils/checkIfValidId.js");
const { getKeyString } = require("../utils/format.js");

exports.selectArticles = async () => {
  const articleSql = `
    SELECT * FROM articles
    ORDER BY created_at DESC
    `;

  const { rows: articles, rowCount } = await db.query(articleSql);

  if (rowCount === 0) {
    return Promise.reject({
      status: 404,
      message: `No articles found`,
    });
  } else {
    return articles;
  }
};

exports.modifyArticles = async (articles) => {
  const updatedArticles = await appendArticleCommentCount(articles);

  return removeArticlesBody(updatedArticles);
};

appendArticleCommentCount = async (articles) => {
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
