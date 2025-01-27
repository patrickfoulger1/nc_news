const db = require("../../db/connection.js");

exports.selectTopics = async () => {
  const sql = "SELECT * FROM topics";
  const { rows: topics } = await db.query(sql);
  if (topics.length === 0) {
    return Promise.reject({ status: 404, message: "No topics found" });
  } else {
    return topics;
  }
};
