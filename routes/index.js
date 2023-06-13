const express = require('express')
const router = express.Router()
const passport = require('../config/passport') // 引入 Passport，需要它幫忙做驗證
const userController = require('../controllers/user-controller')
const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedUser, authenticatedAdmin } = require('../middleware/api-auth')
const upload = require('../middleware/multer') // 載入 multer
const tweetController = require('../controllers/tweet-controller')
const replyController = require('../controllers/reply-controller')
const likeController = require('../controllers/like-controller')
const followController = require('../controllers/follow-controller')
const admin = require('./modules/admin')

router.use('/admin', admin)


// replies
router.post('/tweets/:tweet_id/replies', authenticated, replyController.postComment)
router.get('/tweets/:tweet_id/replies', authenticated, replyController.getComment) 

//like
router.post('/tweets/:id/like', authenticated, likeController.addLike)
router.post('/tweets/:id/unlike', authenticated, likeController.removeLike)

// tweets
router.get('/tweets/:tweet_id', authenticated, authenticatedUser, tweetController.getTweet)
router.post('/tweets', authenticated, authenticatedUser, tweetController.createTweet)
router.get('/tweets', authenticated, authenticatedUser, tweetController.getTweets)

//followships
router.post('/followships', authenticated, authenticatedUser, followController.addFollowing)
router.delete('/followships/:followingId', authenticated, authenticatedUser, followController.removeFollowing)

// router.get('/followships', authenticated, authenticatedUser, userController.getTop)


router.use('/', apiErrorHandler)

module.exports = router