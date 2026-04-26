
const db = require("../../config/database/db_connection");

exports.createUser = (data) => {
  const sql = `
    INSERT INTO users (name, email, password, role_id)
    VALUES (?, ?, ?, ?)
  `;
  return db.promise().query(sql, [
    data.name,
    data.email,
    data.password,
    data.role_id,
  ]);
};

exports.getAllUsers = () => {
  return db.promise().query(`SELECT id, name, email, role_id FROM users`);
};

exports.updateUser = (id, data) => {
  const sql = `
    UPDATE users SET name=?, email=?, role_id=? WHERE id=?
  `;
  return db.promise().query(sql, [
    data.name,
    data.email,
    data.role_id,
    id,
  ]);
};

exports.deleteUser = (id) => {
  return db.promise().query(`DELETE FROM users WHERE id=?`, [id]);
};