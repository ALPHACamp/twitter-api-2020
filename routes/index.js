const express = require('express')
const router = express.Router()
const passport = require('../config/passport') // 引入 Passport，需要它幫忙做驗證
const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedUser, authenticatedAdmin } = require('../middleware/api-auth')
const tweetController = require('../controllers/tweet-controller')
const replyController = require('../controllers/reply-controller')
const likeController = require('../controllers/like-controller')
const followController = require('../controllers/follow-controller')
const admin = require('./modules/admin')

router.use('/api/admin', admin)

// replies
router.post('/api/tweets/:tweet_id/replies', authenticated, replyController.postComment)
router.get('/api/tweets/:tweet_id/replies', authenticated, replyController.getComment) 

//like
router.post('/api/tweets/:id/like', authenticated, likeController.addLike)
router.post('/api/tweets/:id/unlike', authenticated, likeController.removeLike)

// tweets
router.post('/api/tweets', authenticated, authenticatedUser, tweetController.createTweet)
router.get('/api/tweets/:tweet_id', authenticated, authenticatedUser, tweetController.getTweet)
router.get('/api/tweets', authenticated, authenticatedUser, tweetController.getTweets)

//followships
router.post('/api/followships', authenticated, authenticatedUser, followController.addFollowing)
router.delete('/api/followships/:followingId', authenticated, authenticatedUser, followController.removeFollowing)

// router.get('/followships', authenticated, authenticatedUser, userController.getTop)


router.use('/', apiErrorHandler)

module.exports = router