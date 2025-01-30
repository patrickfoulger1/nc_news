const db = require("../../db/connection.js");
const { checkCommentExists } = require("../utils/checkCommentExists.js");

exports.deleteCommentById = async (comment_id) => {
  const deleteSql = `
    DELETE FROM comments
    WHERE comment_id = $1
    `;

  return db.query(deleteSql, [comment_id]);
};
