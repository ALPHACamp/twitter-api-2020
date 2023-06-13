const express = require('express')
const router = express.Router()
const passport = require('../config/passport') // 引入 Passport，需要它幫忙做驗證
const userController = require('../controllers/user-controller')
const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedUser, authenticatedAdmin } = require('../middleware/api-auth')
const upload = require('../middleware/multer') // 載入 multer
const tweetController = require('../controllers/tweet-controller')
const replyController = require('../controllers/reply-controller')
const admin = require('./modules/admin')

router.use('/admin', admin)


router.post('/users/signin', userController.signIn)
router.get('/users/:user_id/tweets', authenticated, authenticatedUser, userController.getUserTweets)
router.get('/users/:user_id/replied_tweets', authenticated, authenticatedUser, userController.getUserRepliedTweets)

// replies
router.post('/tweets/:tweet_id/replies', authenticated, replyController.postComment)
router.get('/tweets/:tweet_id/replies', authenticated, replyController.getComment) 

//like
router.post('/tweets/:id/like', authenticated, userController.addLike)
router.post('/tweets/:id/unlike', authenticated, userController.removeLike)

// tweets
router.get('/tweets/:tweet_id', authenticated, authenticatedUser, tweetController.getTweet)
router.post('/tweets', authenticated, authenticatedUser, tweetController.createTweet)
router.get('/tweets', authenticated, authenticatedUser, tweetController.getTweets)

//followships
router.post('/followships/:user_id', authenticated, authenticatedUser, userController.addFollowing)
router.delete('/followships/:followingId', authenticated, authenticatedUser, userController.removeFollowing)
// router.get('/followships', authenticated, authenticatedUser, userController.getTop)

//user data
router.get('/users/tops', authenticated, authenticatedUser, userController.getTopUsers)
router.get('/users/:user_id/likes', authenticated, authenticatedUser, userController.getUserLikes)
router.get('/users/:user_id/followings', authenticated, authenticatedUser, userController.getUserFollowings)
router.get('/users/:user_id/followers', authenticated,authenticatedUser,  userController.getUserFollowers)
router.get('/users/:user_id/edit', authenticated, authenticatedUser, userController.editUser)
router.put('/users/:user_id', authenticated, authenticatedUser, upload.single('image'), userController.putUser)
router.get('/users/:user_id', authenticated, authenticatedUser, userController.getUser)

router.post('/users', userController.signUp)

router.use('/', apiErrorHandler)

module.exports = router