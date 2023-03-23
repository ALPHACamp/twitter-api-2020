const router = require("express").Router();
const userController = require("../controllers/user-controller");
const tweetController = require("../controllers/tweet-controller");
const { errorHandler } = require("../middleware/error-handler");
const { authenticatedUser } = require("../middleware/auth");
const upload = require("../middleware/multer");

router.post("/api/users", userController.signUp);
router.put(
  "/api/users/:id/setting",
  authenticatedUser,
  userController.putUserSetting
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


router.get(
  "/api/tweets/:tweet_id",
  authenticatedUser,
  tweetController.getTweet
);
router.get("/api/tweets", authenticatedUser, tweetController.getTweets);
router.post("/api/tweets", authenticatedUser, tweetController.postTweet);


router.use("/", errorHandler);

module.exports = router;
