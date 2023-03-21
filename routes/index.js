const router = require("express").Router();
const userController = require("../controllers/user-controller");
const { errorHandler } = require("../middleware/error-handler");

router.post("/api/users/signup", userController.signUp);
router.post("/api/users/signin", userController.signIn);

router.use("/", errorHandler);

module.exports = router;
