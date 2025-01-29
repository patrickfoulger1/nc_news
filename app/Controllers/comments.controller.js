const { deleteCommentById } = require("../Models/comments.model");
const { checkCommentExists } = require("../utils/checkCommentExitsts");

exports.deleteComment = async (request, response, next) => {
  try {
    const {
      params: { comment_id },
    } = request;
    await checkCommentExists(comment_id);
    await deleteCommentById(comment_id);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};
