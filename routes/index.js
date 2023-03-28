const router = require("express").Router();
const userController = require("../controllers/user-controller");
const tweetController = require("../controllers/tweet-controller");
const admin = require("./module/admin");
const { errorHandler } = require("../middleware/error-handler");
const { authenticatedUser } = require("../middleware/auth");
const upload = require("../middleware/multer");

// - Admin
router.use("/api/admin", admin);

// - User
router.get(
  "/api/users/current_user",
  authenticatedUser,
  userController.getCurrentUser
);
router.get(
  "/api/users/:id/followers",
  authenticatedUser,
  userController.getUserFollowers
);
router.get(
  "/api/users/:id/followings",
  authenticatedUser,
  userController.getUserFollowings
);
router.get(
  "/api/users/:id/tweets",
  authenticatedUser,
  userController.getUserTweets
);
router.get(
  "/api/users/:id/replied_tweets",
  authenticatedUser,
  userController.getUserReplies
);
router.get(
  "/api/users/:id/likes",
  authenticatedUser,
  userController.getUserLikes
);
router.post("/api/users", userController.signUp);
router.get("/api/users/top", authenticatedUser, userController.getTopUser);
router.get("/api/users/:id", authenticatedUser, userController.getUser);
router.put(
  "/api/users/:id/setting",
  authenticatedUser,
  userController.putUserSetting
);
router.patch(
  "/api/users/:id/cover",
  authenticatedUser,
  userController.patchUserCover
);
router.put(
  "/api/users/:id",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  authenticatedUser,
  userController.putUser
);
router.post("/api/users/signin", userController.signIn);

// - Tweet
router.post("/api/tweets/:id/like", authenticatedUser, tweetController.addLike);
router.post(
  "/api/tweets/:id/unLike",
  authenticatedUser,
  tweetController.removeLike
);
router.get(
  "/api/tweets/:tweet_id/replies",
  authenticatedUser,
  tweetController.getReplies
);
router.post(
  "/api/tweets/:tweet_id/replies",
  authenticatedUser,
  tweetController.postReply
);
router.get(
  "/api/tweets/:tweet_id",
  authenticatedUser,
  tweetController.getTweet
);
router.get("/api/tweets", authenticatedUser, tweetController.getTweets);
router.post("/api/tweets", authenticatedUser, tweetController.postTweet);

// - Followship
router.delete(
  "/api/followships/:followingId",
  authenticatedUser,
  userController.removeFollowing
);
router.post("/api/followships", authenticatedUser, userController.addFollowing);

// - Error
router.use("/", errorHandler);

module.exports = router;
