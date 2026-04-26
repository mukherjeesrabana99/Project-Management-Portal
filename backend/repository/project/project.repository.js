
const db = require("../../config/database/db_connection");

exports.createProject = (data) => {
  return db.promise().query(
    `INSERT INTO projects 
    (title, description, client_id, status, start_date, end_date)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.title,
      data.description,
      data.client_id,
      "planned",
      data.start_date,
      data.end_date,
    ]
  );
};

exports.assignUsers = (projectId, users) => {
  const values = users.map((u) => [projectId, u.user_id]);
  return db.promise().query(
    `INSERT INTO project_users (project_id, user_id) VALUES ?`,
    [values]
  );
};

exports.getProjects = () => {
  return db.promise().query(`
    SELECT p.*, c.company_name as client_name
    FROM projects p
    JOIN clients c ON p.client_id = c.id
  `);
};

exports.getProjectById = (id) => {
  return db.promise().query(
    `SELECT * FROM projects WHERE id=?`,
    [id]
  );
};

exports.updateProject = (id, data) => {
  return db.promise().query(
    `UPDATE projects SET title=?, description=?, client_id=?, start_date=?, end_date=? WHERE id=?`,
    [
      data.title,
      data.description,
      data.client_id,
      data.start_date,
      data.end_date,
      id,
    ]
  );
};

exports.updateStatus = (id, status) => {
  return db.promise().query(
    `UPDATE projects SET status=? WHERE id=?`,
    [status, id]
  );
};

exports.insertStatusLog = (log) => {
  return db.promise().query(
    `INSERT INTO project_status_logs 
    (project_id, old_status, new_status, changed_by)
    VALUES (?, ?, ?, ?)`,
    [log.project_id, log.old_status, log.new_status, log.changed_by]
  );
};

exports.getProjectsWithClientAndAssignedusers=()=>{
  return db.promise().query(`
    SELECT p.*, c.company_name as client_name, 
    GROUP_CONCAT(u.name) as assigned_users
    FROM projects p
    JOIN clients c ON p.client_id = c.id
    LEFT JOIN project_users pu ON p.id = pu.project_id
    LEFT JOIN users u ON pu.user_id = u.id
    GROUP BY p.id
  `);
  
}