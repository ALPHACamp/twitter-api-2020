const router = require("express").Router();
const userController = require("../controllers/user-controller");
const { errorHandler } = require("../middleware/error-handler");
const { authenticatedUser } = require('../middleware/auth')

router.post("/api/users", userController.signUp);
router.put("/api/users/:id", authenticatedUser ,userController.putUser);
router.post("/api/users/signin",userController.signIn);

router.use("/", errorHandler);

module.exports = router;
