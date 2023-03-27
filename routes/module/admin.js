const router = require("express").Router();
const adminController = require("../../controllers/admin-controller");
const { authenticatedAdmin } = require("../../middleware/auth");

router.post("/signin", adminController.signIn);
router.get("/users", authenticatedAdmin, adminController.getUsers);
router.delete("/tweets/:id", authenticatedAdmin, adminController.deleteTweet);
router.get("/tweets", authenticatedAdmin, adminController.getTweets);

module.exports = router;
