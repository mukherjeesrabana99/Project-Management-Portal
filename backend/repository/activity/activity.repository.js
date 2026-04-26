const db = require("../../config/database/db_connection");

exports.logActivity = (userId, action, entityType, entityId) => {
  return db.promise().query(
    `INSERT INTO activity_logs (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)`,
    [userId, action, entityType, entityId]
  );
};

exports.getActivityStats = () => {
  return db.promise().query(`
    SELECT 
      COUNT(*) as total_activities,
      COUNT(DISTINCT user_id) as unique_users,
      entity_type,
      COUNT(*) as count_by_type
    FROM activity_logs 
    GROUP BY entity_type
  `);
};

exports.getActivityTimeline = (period = 'day') => {
  let dateFormat;
  if (period === 'month') {
    dateFormat = "DATE_FORMAT(created_at, '%Y-%m')";
  } else if (period === 'week') {
    dateFormat = "DATE_FORMAT(created_at, '%Y-%U')";
  } else {
    dateFormat = "DATE(created_at)";
  }
  return db.promise().query(`
    SELECT 
      ${dateFormat} as date,
      COUNT(*) as count
    FROM activity_logs 
    GROUP BY date
    ORDER BY date
  `);
};

exports.getActivityByUser = () => {
  return db.promise().query(`
    SELECT 
      u.name as user_name,
      COUNT(*) as activity_count
    FROM activity_logs al
    JOIN users u ON al.user_id = u.id
    GROUP BY al.user_id, u.name
    ORDER BY activity_count DESC
  `);
};

exports.getRecentActivity = (limit = 10) => {
  return db.promise().query(`
    SELECT 
      al.*,
      u.name as user_name
    FROM activity_logs al
    JOIN users u ON al.user_id = u.id
    ORDER BY al.created_at DESC
    LIMIT ?
  `, [limit]);
};