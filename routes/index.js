const router = require("express").Router();
const userController = require("../controllers/user-controller");
const { errorHandler } = require("../middleware/error-handler");
const passport = require("passport");

router.post("/api/users/signup", userController.signUp);
router.post(
  "/api/users/signin",
  passport.authenticate("local", { session: false }),
  userController.signIn
);

router.use("/", errorHandler);

module.exports = router;
