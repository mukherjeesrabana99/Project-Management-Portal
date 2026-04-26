
const repo = require("../repositories/dashboard.repository");

exports.getAdminDashboard = async () => {
  const stats = await repo.getAdminStats();
  const [growth] = await repo.getUserGrowth();
  const [activity] = await repo.getRecentActivity();

  return {
    stats,
    growth,
    activity,
  };
};