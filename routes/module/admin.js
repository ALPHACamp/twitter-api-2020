const router = require("express").Router();
const adminController = require("../../controllers/admin-controller");
const { authenticatedAdmin } = require("../../middleware/auth");

router.post("/signin", adminController.signIn)
router.get("/users", authenticatedAdmin ,adminController.getUsers);

module.exports = router;
