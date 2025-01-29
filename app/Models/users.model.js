const db = require("../../db/connection.js");

exports.selectUsers = async () => {
  const userSelectSql = `
    SELECT * FROM users
    `;

  const { rows: users, rowCount } = await db.query(userSelectSql);

  if (rowCount === 0) {
    return Promise.reject({ status: 404, message: "No users found" });
  } else {
    return users;
  }
};
