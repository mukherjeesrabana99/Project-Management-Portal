const express = require("express");
const router = express.Router();

const controller = require("../../controller/dashboard/dashboard.controller");
const { authenticateToken } = require("../../middleware/auth");
const { authorize } = require("../../middleware/rbac");

router.use(authenticateToken);

router.get(
  "/admin",
  authenticateToken,
  authorize("Admin"),
  controller.getAdminDashboard,
);

module.exports = router;
