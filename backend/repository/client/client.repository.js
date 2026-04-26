
const db = require("../../config/database/db_connection");

exports.createClient = (data) => {
  return db.promise().query(
    `INSERT INTO clients (company_name, contact_person, email, phone, address, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [data.company, data.name, data.email, data.phone, data.address, new Date(), new Date()]
  );
};

exports.getClients = () => {
  return db.promise().query(`
    SELECT c.*, COUNT(p.id) as project_count
    FROM clients c
    LEFT JOIN projects p ON c.id = p.client_id
    GROUP BY c.id
  `);
};

exports.updateClient = (id, data) => {
  return db.promise().query(
    `UPDATE clients SET company_name=?, contact_person=?, email=?, phone=?, address=?, updated_at=? WHERE id=?`,
    [data.company, data.name, data.email, data.phone, data.address, new Date(), id]
  );
};

exports.deleteClient = (id) => {
  return db.promise().query(`DELETE FROM clients WHERE id=?`, [id]);
};