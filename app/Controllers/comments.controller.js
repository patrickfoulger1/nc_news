const {
  deleteCommentById,
  updateComment,
} = require("../Models/comments.model");
const { checkCommentExists } = require("../utils/checkCommentExists");

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

exports.patchComment = async (request, response, next) => {
  try {
    const {
      params: { comment_id },
      body: { inc_votes },
    } = request;
    await checkCommentExists(comment_id);
    const updatedComment = await updateComment(comment_id, inc_votes);
    response.status(200).send({ comment: updatedComment });
  } catch (error) {
    next(error);
  }
};
