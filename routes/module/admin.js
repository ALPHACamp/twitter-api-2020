const router = require("express").Router();
const adminController = require("../../controllers/admin-controller");
const { authenticatedAdmin } = require("../../middleware/auth");

router.get("/users", authenticatedAdmin, adminController.getUsers);

module.exports = router;
