const express = require('express')
const route = express.Router()

const tweetController = require('../../../controllers/tweet-controller')

route.get('/:tweetId/replies', tweetController.getReplies)
route.post('/:tweetId/replies', tweetController.postReply)
route.get('/:tweetId', tweetController.getTweet)

route.post('/tweetId/like', tweetController.addLike)
route.post('/tweetId/unlike', tweetController.removeLike)

route.post('/', tweetController.postTweet)
route.get('/', tweetController.getTweets)

module.exports = route
