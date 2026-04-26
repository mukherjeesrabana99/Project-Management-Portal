
const service = require("../services/dashboard.service");

exports.getAdminDashboard = async (req, res) => {
  const data = await service.getAdminDashboard();
  res.json(data);
};