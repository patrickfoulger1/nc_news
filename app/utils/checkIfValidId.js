exports.checkIfValidId = (id) => {
  //if article_id isn't numeric
  if (isNaN(id)) {
    return Promise.reject({
      status: 400,
      message: `Bad Request: NOT NULL VIOLATION`,
    });
  } else {
    return Promise.resolve(undefined);
  }
};
