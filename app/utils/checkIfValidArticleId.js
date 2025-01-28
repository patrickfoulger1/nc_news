exports.checkIfValidArticleId = (article_id) => {
  //if article_id isn't numeric
  if (isNaN(article_id)) {
    console.log("here");
    return Promise.reject({
      status: 400,
      message: `${article_id} is not a valid id`,
    });
  } else {
    return Promise.resolve(undefined);
  }
};
