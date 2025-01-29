const db = require("../../db/connection.js");

exports.selectTopics = async () => {
  const topicSql = "SELECT * FROM topics";
  const { rows: topics, rowCount } = await db.query(topicSql);
  if (rowCount === 0) {
    return Promise.reject({ status: 404, message: "No topics found" });
  } else {
    return topics;
  }
};
