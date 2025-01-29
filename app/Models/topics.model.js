const db = require("../../db/connection.js");

exports.selectTopics = async () => {
  const topicSql = "SELECT * FROM topics";
  const { rows: topics, rowCount } = await db.query(topicSql);

  return topics;
};
