const db = require("../../db/connection.js");
exports.checkArticleExists = async (article_id) => {
  const selectArticleSql = `
    SELECT * FROM articles
    WHERE article_id = $1
    `;

  const { rows: articles, rowCount } = await db.query(selectArticleSql, [
    article_id,
  ]);

  if (rowCount === 0) {
    return Promise.reject({
      status: 404,
      message: `Article with id ${article_id} does not exist`,
    });
  } else {
    return;
  }
};
