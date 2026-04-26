const express = require("express");
const router = express.Router();
const controller = require("../../controller/activity/activity.controller");
const { authenticateToken } = require("../../middleware/auth");
const { authorize } = require("../../middleware/rbac");

router.use(authenticateToken);

router.get("/stats", authorize("Admin"), controller.getActivityStats);
router.get("/timeline", authorize("Admin"), controller.getActivityTimeline);
router.get("/by-user", authorize("Admin"), controller.getActivityByUser);
router.get("/recent", authorize("Admin"), controller.getRecentActivity);

module.exports = router;