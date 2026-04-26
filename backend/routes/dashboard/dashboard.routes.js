const express = require("express");
const router = express.Router();

const controller = require("../controllers/dashboard/dashboard.controller");
const { authenticate } = require("../middleware/auth");
const { authorize } = require("../middleware/rbac");

router.use(authenticate);

router.get(
  "/admin",
  authenticate,
  authorize("admin"),
  controller.getAdminDashboard,
);

module.exports = router;
