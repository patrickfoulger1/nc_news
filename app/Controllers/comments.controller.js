const { deleteCommentById } = require("../Models/comments.model");

exports.deleteComment = async (request, response, next) => {
  try {
    const {
      params: { comment_id },
    } = request;
    await deleteCommentById(comment_id);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};
