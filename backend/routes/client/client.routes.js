
const router = require("express").Router();
const controller = require("../../controller/client/client.controller");
const { authenticateToken } = require("../../middleware/auth");
const { authorize } = require("../../middleware/rbac");

router.use(authenticateToken);

router.post("/", authorize("Admin"), controller.createClient);

router.get("/me", authorize("Client"), controller.getClientProfile);
router.put("/me", authorize("Client"), controller.updateClientProfile);

router.put("/:id", authorize("Admin"), controller.updateClient);
router.delete("/:id", authorize("Admin"), controller.deleteClient);

router.get("/", authorize("Admin"), controller.getClients);

module.exports = router;