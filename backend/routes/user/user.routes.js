
const express = require("express");
const router = express.Router();

const controller = require("../controllers/user/user.controller");
const { authenticate } = require("../middleware/auth");
const { authorize } = require("../middleware/rbac");

router.use(authenticate);

router.get("/", authorize("admin"), controller.getUsers);
router.post("/", authorize("admin"), controller.createUser);
router.put("/:id", authorize("admin"), controller.updateUser);
router.delete("/:id", authorize("admin"), controller.deleteUser);

module.exports = router;