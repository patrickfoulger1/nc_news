const db = require("../../db/connection.js");
exports.checkTopicExists = async (topic) => {
  const selectArticleSql = `
    SELECT * FROM topics
    WHERE slug = $1
    `;

  const { rows: topics, rowCount } = await db.query(selectArticleSql, [topic]);

  if (rowCount === 0) {
    return Promise.reject({
      status: 404,
      message: `The topic ${topic} does not exist`,
    });
  } else {
    return;
  }
};
