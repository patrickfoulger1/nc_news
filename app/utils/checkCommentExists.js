const db = require("../../db/connection.js");
exports.checkCommentExists = async (comment_id) => {
  const selectCommentSql = `
    SELECT * FROM comments
    WHERE comment_id = $1
    `;

  const { rowCount } = await db.query(selectCommentSql, [comment_id]);

  if (rowCount === 0) {
    return Promise.reject({
      status: 404,
      message: `Comment with id ${comment_id} does not exist`,
    });
  } else {
    return;
  }
};
