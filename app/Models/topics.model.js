const db = require("../../db/connection.js");

exports.selectTopics = async () => {
  const topicSql = "SELECT * FROM topics";
  const { rows: topics, rowCount } = await db.query(topicSql);

  return topics;
};

exports.insertTopic = async ({ slug, description }) => {
  const insertArticleSql = `
  INSERT INTO topics(slug, description)
  VALUES($1, $2)
  RETURNING *
`;

  if (typeof slug === "string" && typeof description === "string") {
    const { rows: topics } = await db.query(insertArticleSql, [
      slug,
      description,
    ]);

    return topics[0];
  } else {
    return Promise.reject({
      status: 400,
      message: "Bad Request: Keys missing or wrong data type",
    });
  }
};
