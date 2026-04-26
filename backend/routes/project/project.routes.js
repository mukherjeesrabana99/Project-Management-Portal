
const router = require("express").Router();
const controller = require("../../controller/project/project.controller");
const { authenticateToken } = require("../../middleware/auth");
const { authorize } = require("../../middleware/rbac");

router.use(authenticateToken);

router.post("/", authorize("Admin"), controller.createProject);

router.put("/:id/status", authorize("Admin", "Client"), controller.updateStatus);
router.get("/", authorize("Admin", "Client"), controller.getProjects);

module.exports = router;