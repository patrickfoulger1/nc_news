const db = require("../../db/connection.js");

exports.selectUsers = async () => {
  const userSelectSql = `
    SELECT * FROM users
    `;

  const { rows: users, rowCount } = await db.query(userSelectSql);

  return users;
};
