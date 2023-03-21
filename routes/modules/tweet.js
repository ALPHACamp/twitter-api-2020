const express = require('express');

const router = express.Router();
const tweetController = require('../../controllers/tweet-controller');

router.get('/', tweetController.getAllTweets);
router.post('/', tweetController.addNewTweet);
router.get('/:tweetId', tweetController.getTweet);

module.exports = router;
