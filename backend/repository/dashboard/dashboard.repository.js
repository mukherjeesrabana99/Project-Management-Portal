
const db = require("../../config/database/db_connection");

exports.getAdminStats = async () => {
  const [users] = await db.promise().query(`SELECT COUNT(*) as totalUsers FROM users`);
  const [clients] = await db.promise().query(`SELECT COUNT(*) as totalClients FROM clients`);
  const [projects] = await db.promise().query(`SELECT COUNT(*) as totalProjects FROM projects`);

  return {
    totalUsers: users[0].totalUsers,
    totalClients: clients[0].totalClients,
    totalProjects: projects[0].totalProjects,
  };
};

exports.getUserGrowth = async () => {
  return db.promise().query(`
    SELECT DATE(created_at) as date, COUNT(*) as count
    FROM users
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `);
};

exports.getRecentActivity = async () => {
  return db.promise().query(`
    SELECT action, entity_type, entity_id, created_at
    FROM activity_logs
    ORDER BY created_at DESC
    LIMIT 10
  `);
};