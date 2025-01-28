const db = require("../../db/connection.js");
const { checkCommentExists } = require("../utils/checkCommentExitsts");
const { checkIfValidId } = require("../utils/checkIfValidId");

exports.deleteCommentById = async (comment_id) => {
  await checkCommentExists(comment_id);
  await checkIfValidId(comment_id);
  const deleteSql = `
    DELETE FROM comments
    WHERE comment_id = $1
    `;

  return db.query(deleteSql, [comment_id]);
};
