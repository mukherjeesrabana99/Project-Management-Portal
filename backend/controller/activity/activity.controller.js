const service = require("../../service/activity/activity.service");

exports.getActivityStats = async (req, res) => {
  try {
    const data = await service.getActivityStats();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getActivityTimeline = async (req, res) => {
  try {
    const period = req.query.period || 'day'; 
    const data = await service.getActivityTimeline(period);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getActivityByUser = async (req, res) => {
  try {
    const data = await service.getActivityByUser();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const data = await service.getRecentActivity(limit);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};