const express = require("express");
const passport = require('../config/passport')
const router = express.Router();
const admin = require("./modules/admin");
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const followships = require('./modules/followships')

const authenticated = passport.authenticate("jwt", { session: false });

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.role === "admin") {
      return next();
    }
    return res.json({ status: "error", message: "permission denied" });
  } else {
    return res.json({ status: "error", message: "permission denied" });
  }
};

router.use("/admin", admin);

module.exports = router;
