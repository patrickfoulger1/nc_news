exports.checkIfValidId = (id) => {
  //if article_id isn't numeric
  if (isNaN(id)) {
    return Promise.reject({
      status: 400,
      message: `Not a valid id`,
    });
  } else {
    return Promise.resolve(undefined);
  }
};
