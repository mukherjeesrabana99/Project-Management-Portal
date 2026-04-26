
const db = require("../../config/database/db_connection");

exports.createUser = (data) => {
  const sql = `
    INSERT INTO users (name, email, password, role_id, client_id)
    VALUES (?, ?, ?, ?, ?)
  `;
  return db.promise().query(sql, [
    data.name,
    data.email,
    data.password,
    data.role_id,
    data.client_id || null,
  ]);
};

exports.getAllUsers = () => {
  return db.promise().query(`
    SELECT u.id, u.name, u.email,u.role_id,u.client_id, u.created_at, r.role_name as role_name, c.company_name as client_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    LEFT JOIN clients c ON u.client_id = c.id
    WHERE u.role_id <> 1
  `);
};

exports.updateUser = (id, data) => {
  const sql = `
    UPDATE users SET name=?, email=?, role_id=?, client_id=? WHERE id=?
  `;
  return db.promise().query(sql, [
    data.name,
    data.email,
    data.role_id,
    data.client_id || null,
    id,
  ]);
};

exports.deleteUser = (id) => {
  return db.promise().query(`DELETE FROM users WHERE id=?`, [id]);
};