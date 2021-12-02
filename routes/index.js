const express = require("express");
const userController = require("../controllers/userController");
const tweetController = require("../controllers/tweetController");
const passport = require("../config/passport");
const authenticated = passport.authenticate("jwt", { session: false });

module.exports = (app) => {
  // JWT signin & signup
  app.post("/api/users", userController.signUp);
  //tweets
  app.get("/api/tweets", tweetController.getTweets);
};
