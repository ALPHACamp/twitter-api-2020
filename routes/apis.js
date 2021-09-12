const express = require("express");
const router = express.Router();

const passport = require("../config/passport");
const helpers = require("../_helpers");

const authenticated = (req, res, next) => {};

router.get("/", async (req, res) => {
  res.json("Hello world");
});

module.exports = router;
