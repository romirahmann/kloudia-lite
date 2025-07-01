const db = require("../database/db.config");

const login = async (username) =>
  await db
    .select("u.username", "u.password", "u.role_id", "r.roleName")
    .from("users as u")
    .join("role as r", "r.role_id", "u.role_id")
    .where("username", username);

module.exports = {
  login,
};
