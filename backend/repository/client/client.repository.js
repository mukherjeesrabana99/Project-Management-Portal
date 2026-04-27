
const db = require("../../config/database/db_connection");

exports.createClient = (data) => {
  const company = data.company_name ?? data.company;
  const contactPerson = data.contact_person ?? data.name;
  return db.promise().query(
    `INSERT INTO clients (company_name, contact_person, email, phone, address, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [company, contactPerson, data.email, data.phone, data.address, new Date(), new Date()]
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

exports.getClientById = (id) => {
  return db.promise().query(`
    SELECT c.*
    FROM clients c
    WHERE c.id = ?
    LIMIT 1
  `, [id]);
};

exports.updateClient = (id, data) => {
  const company = data.company_name ?? data.company;
  const contactPerson = data.contact_person ?? data.name;
  return db.promise().query(
    `UPDATE clients SET company_name = ?, contact_person = ?, email = ?, phone = ?, address = ?, updated_at = ? WHERE id = ?`,
    [company, contactPerson, data.email, data.phone, data.address, new Date(), id]
  );
};

exports.deleteClient = (id) => {
  return db.promise().query(`DELETE FROM clients WHERE id=?`, [id]);
};