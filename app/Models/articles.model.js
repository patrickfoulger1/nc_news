const db = require("../../db/connection.js");

exports.selectArticleById = async (article_id) => {
  const sql = `
  SELECT * FROM articles
  WHERE article_id = $1
  `;

  const { rows: articles } = await db.query(sql, [article_id]);
  if (articles.length === 0) {
    return Promise.reject({
      status: 404,
      message: `No article with the ID ${article_id} found`,
    });
  } else {
    return articles[0];
  }
};
