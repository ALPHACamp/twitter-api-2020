const express = require("express");
const router = express.Router();
const admin = require("./modules/admin");
const userController = require("../controllers/user-controller");
const passport = require("../config/passport");
const {
  authenticated,
  authenticatedUser,
  authenticatedAdmin,
} = require("../middleware/api-auth");
const replyController = require("../controllers/reply-controller");

// admin
router.use("/api/admin", admin);

//users
router.post("/api/users/signin", userController.signIn);
router.post("/api/users", userController.signUp);

router.get(
  "/api/users/:id/followings",
  authenticated,
  authenticatedUser,
  userController.getFollowings
);
router.get(
  "/api/users/:id/followers",
  authenticated,
  authenticatedUser,
  userController.getFollowers
);

router.get(
  "/api/users/:id/tweets",
  authenticated,
  authenticatedUser,
  userController.getUserTweets
);
router.get(
  "/api/users/:id/replied_tweets",
  authenticated,
  authenticatedUser,
  userController.getUserRepliedTweets
);

router.get(
  "/api/users/:id/likes",
  authenticated,
  authenticatedUser,
  userController.getUserLikes
);

router.get(
  "/api/users/:id",
  authenticated,
  authenticatedUser,
  userController.getUserProfile
);
router.put(
  "/api/users/:id",
  authenticated,
  authenticatedUser,
  userController.putUserProfile
);

//like
router.post(
  "/api/tweets/:id/like",
  authenticated,
  authenticatedUser,
  userController.postTweetLike
);
router.post(
  "/api/tweets/:id/unlike",
  authenticated,
  authenticatedUser,
  userController.postTweetUnlike
);
//replies
router.get(
  "/api/tweets/:tweet_id/replies",
  authenticated,
  authenticatedUser,
  replyController.getTweetReply
);
router.post(
  "/api/tweets/:tweet_id/replies",
  authenticated,
  authenticatedUser,
  replyController.postTweetReply
);

//tweets
router.get(
  "/api/tweets/:tweet_id",
  authenticated,
  authenticatedUser,
  userController.getTweet
);
router.get(
  "/api/tweets",
  authenticated,
  authenticatedUser,
  userController.getTweets
);
router.post(
  "/api/tweets",
  authenticated,
  authenticatedUser,
  userController.postTweets
);

//followships

module.exports = router;
