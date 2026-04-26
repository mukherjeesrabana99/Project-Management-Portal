
const express = require("express");
const router = express.Router();

const controller = require("../../controller/user/user.controller");
const { authenticateToken } = require("../../middleware/auth");
const { authorize } = require("../../middleware/rbac");

router.use(authenticateToken);

router.get("/", authorize("Admin"), controller.getUsers);
router.post("/", authorize("Admin"), controller.createUser);
router.put("/:id", authorize("Admin"), controller.updateUser);
router.delete("/:id", authorize("Admin"), controller.deleteUser);

module.exports = router;