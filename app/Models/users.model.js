const db = require("../../db/connection.js");

exports.selectUsers = async () => {
  const userSelectSql = `
    SELECT * FROM users
    `;

  const { rows: users, rowCount } = await db.query(userSelectSql);

  return users;
};

exports.selectUserByUsername = async (username) => {
  const selectUserSql = `
  SELECT * FROM users
  WHERE username = $1
  `;

  const { rows: users, rowCount } = await db.query(selectUserSql, [username]);

  if (rowCount === 0) {
    return Promise.reject({
      status: 404,
      message: `No user with the username ${username} found`,
    });
  } else {
    return users[0];
  }
};
