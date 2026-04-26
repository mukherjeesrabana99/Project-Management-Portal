const repo = require("../../repository/activity/activity.repository");

exports.getActivityStats = async () => {
  const [rows] = await repo.getActivityStats();
  const stats = {
    totalActivities: rows[0]?.total_activities || 0,
    uniqueUsers: rows[0]?.unique_users || 0,
    activitiesByType: rows.map(row => ({
      type: row.entity_type,
      count: row.count_by_type
    }))
  };
  return stats;
};

exports.getActivityTimeline = async (period = 'day') => {
  const [rows] = await repo.getActivityTimeline(period);
  return {
    period,
    data: rows.map(row => ({
      date: row.date,
      count: row.count
    }))
  };
};

exports.getActivityByUser = async () => {
  const [rows] = await repo.getActivityByUser();
  return rows.map(row => ({
    user: row.user_name,
    count: row.activity_count
  }));
};

exports.getRecentActivity = async (limit = 10) => {
  const [rows] = await repo.getRecentActivity(limit);
  return rows.map(row => ({
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    action: row.action,
    entityType: row.entity_type,
    entityId: row.entity_id,
    createdAt: row.created_at
  }));
};