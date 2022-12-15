const express = require('express')
const router = express.Router()
const passport = require('passport')

const replyController = require('../../controllers/replyController')
const userController = require('../../controllers/userController')
const tweetController = require('../../controllers/tweetController')
const likeController = require('../../controllers/likeController')
const { authenticated } = require('../../middleware/auth')
const { signInFail } = require('../../middleware/error-handler')

router.post('/users', userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false, failWithError: true }), userController.signIn, signInFail)

router.post('/tweets/:tweet_id/replies', authenticated, replyController.postReply)
router.get('/tweets/:tweet_id/replies', authenticated, replyController.getReplies)
router.get('/tweets/:tweet_id', authenticated, tweetController.getTweet)
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweet)

router.post('/tweets/:id/like', authenticated, likeController.addLike)
router.post('/tweets/:id/unlike', authenticated, likeController.unLike)
module.exports = router
