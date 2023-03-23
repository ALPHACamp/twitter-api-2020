const router = require("express").Router();
const userController = require("../controllers/user-controller");
const tweetController = require("../controllers/tweet-controller");
const { errorHandler } = require("../middleware/error-handler");
const { authenticatedUser } = require("../middleware/auth");

router.post("/api/users", userController.signUp);
router.post("/api/users/signin", userController.signIn);
router.get("api/tweets/:tweet_id", authenticatedUser, tweetController.getTweet);
router.get("/api/tweets", authenticatedUser, tweetController.getTweets);
router.post("/api/tweets", authenticatedUser, tweetController.postTweet);
router.use("/", errorHandler);

module.exports = router;
