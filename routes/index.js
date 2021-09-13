const express = require("express");
const router = express.Router();
const admin = require("./modules/admin");
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const followships = require('./modules/followships')

router.use("/admin", admin);

module.exports = router;
