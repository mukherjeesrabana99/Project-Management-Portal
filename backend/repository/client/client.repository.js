
const db = require("../../config/database/db_connection");

exports.createClient = (data) => {
  return db.promise().query(
    `INSERT INTO clients (company_name, contact_person, email, phone, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`,
    [data.company_name, data.contact_person, data.email, data.phone, new Date(), new Date()]
  );
};

exports.getClients = () => {
  return db.promise().query(`SELECT * FROM clients`);
};

exports.updateClient = (id, data) => {
  return db.promise().query(
    `UPDATE clients SET company_name=?, contact_person=?, email=?, phone=?, updated_at=? WHERE id=?`,
    [data.company_name, data.contact_person, data.email, data.phone, new Date(), id]
  );
};

exports.deleteClient = (id) => {
  return db.promise().query(`DELETE FROM clients WHERE id=?`, [id]);
};