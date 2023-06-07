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
// user tweets
router.get(
  "/api/users/:id/tweets", authenticated, authenticatedUser, userController.getUserTweets);
router.get(
  "/api/users/:id/replied_tweets", authenticated, authenticatedUser, userController.getUserRepliedTweets);
router.get(
  "/api/users/:id/likes", authenticated, authenticatedUser, userController.getUserLikes);
router.post(
  "/api/tweets/:id/like", authenticated, authenticatedUser, userController.postTweetLike);
router.post(
  "/api/tweets/:id/unlike", authenticated, authenticatedUser, userController.postTweetUnlike);
router.get(
  "/api/tweets/:tweet_id", authenticated, authenticatedUser, userController.getTweet);
router.get(
  "/api/tweets", authenticated, authenticatedUser, userController.getTweets);
router.post(
  "/api/tweets", authenticated, authenticatedUser, userController.postTweets);
// router.get(
//   "/api/users/:id",
//   authenticated,
//   authenticatedUser,
//   userController.getUser
// );
// router.put(
//   "/api/users/:id",
//   authenticated,
//   authenticatedUser,
//   userController.putUser
// );
module.exports = router;