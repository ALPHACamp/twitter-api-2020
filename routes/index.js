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

// user login
router.post('/api/users/signin', userController.signIn)
router.get('/api/users/tops', authenticated, authenticatedUser, userController.getTopUsers)
router.post('/api/users', userController.signUp)

// user profile
router.get('/api/users/:user_id/edit', authenticated, authenticatedUser, userController.editUser)
router.put('/api/users/:user_id', authenticated, authenticatedUser, upload.single('image'), userController.putUser)
router.get('/api/users/:user_id', authenticated, authenticatedUser, userController.getUser)

// user tweets
router.get('/api/users/:user_id/tweets', authenticated, authenticatedUser, userController.getUserTweets)
router.get('/api/users/:user_id/replied_tweets', authenticated, authenticatedUser, userController.getUserRepliedTweets)

// user followships
router.post('/api/users/following/:user_id', authenticated, authenticatedUser, userController.addFollowing)
router.delete('/api/users/following/:user_id', authenticated, authenticatedUser, userController.removeFollowing)
router.get('/api/users/:user_id/followings', authenticated, authenticatedUser, userController.getUserFollowings)
router.get('/api/users/:user_id/followers', authenticated, authenticatedUser, userController.getUserFollowers)

// user likes
router.get('/api/users/:user_id/likes', authenticated, authenticatedUser, userController.getUserLikes)

router.use('/api/admin', admin)

// replies
router.post('/api/tweets/:tweet_id/replies', authenticated, replyController.postComment)
router.get('/api/tweets/:tweet_id/replies', authenticated, replyController.getComment) 

//like
router.post('/api/tweets/:id/like', authenticated, likeController.addLike)
router.post('/api/tweets/:id/unlike', authenticated, likeController.removeLike)

// tweets
router.get('/api/tweets/:tweet_id', authenticated, authenticatedUser, tweetController.getTweet)
router.post('/api/tweets', authenticated, authenticatedUser, tweetController.createTweet)
router.get('/api/tweets', authenticated, authenticatedUser, tweetController.getTweets)

//followships
router.post('/api/followships', authenticated, authenticatedUser, followController.addFollowing)
router.delete('/api/followships/:followingId', authenticated, authenticatedUser, followController.removeFollowing)


// error handler
router.use('/', apiErrorHandler)

module.exports = router