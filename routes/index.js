const express = require("express");
const router = express.Router();
const admin = require('./modules/admin');
const userController = require("../controllers/user-controller");
const passport = require("../config/passport");
const {
  authenticated,
  authenticatedUser,
  authenticatedAdmin,
} = require("../middleware/api-auth");

// admin
router.use("/api/admin", admin);

//users
router.post("/api/users/signin", userController.signIn);
router.post("/api/users", userController.signUp);

module.exports = router;
