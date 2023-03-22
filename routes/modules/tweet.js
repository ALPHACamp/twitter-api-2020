const express = require('express');

const router = express.Router();
const tweetController = require('../../controllers/tweet-controller');

router.get('/:tweetId/replies', tweetController.getReplies);
router.post('/:tweetId/replies', tweetController.postReply);
router.post('/:tweetId/like', tweetController.addLike);
router.post('/:tweetId/unlike', tweetController.removeLike);
router.get('/:tweetId', tweetController.getTweet);

router.get('/', tweetController.getAllTweets);
router.post('/', tweetController.addNewTweet);
module.exports = router;
