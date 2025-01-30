const db = require("../../db/connection.js");
const { checkCommentExists } = require("../utils/checkCommentExists.js");

exports.deleteCommentById = async (comment_id) => {
  const deleteSql = `
    DELETE FROM comments
    WHERE comment_id = $1
    `;

  return db.query(deleteSql, [comment_id]);
};

exports.updateComment = async (comment_id, inc_votes) => {
  const updateCommentSql = `
      UPDATE comments
      SET votes = votes + $1
      WHERE comment_id = $2
      RETURNING *
      `;

  const { rows: updatedComments } = await db.query(updateCommentSql, [
    inc_votes,
    comment_id,
  ]);

  return updatedComments[0];
};
