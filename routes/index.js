const express = require('express')
const router = express.Router()
const passport = require('../config/passport') // 引入 Passport，需要它幫忙做驗證
const userController = require('../controllers/user-controller')
const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/api-auth')
const upload = require('../middleware/multer') // 載入 multer
const tweetController = require('../controllers/tweet-controller')
const replyController = require('../controllers/reply-controller')
const admin = require('./modules/admin')

router.use('/admin', admin)


router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.get('/users/:user_id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:user_id/replied_tweets', authenticated, userController.getUserRepliedTweets)

// ! branch api/admin
// router.post('/followships/:user_id', authenticated, likeController.addFollowing)

router.get('/tweets/:tweet_id/replies', authenticated, replyController.getComment) 
router.post('/tweets/:tweet_id/replies', authenticated, replyController.postComment)

router.get('/tweets/:tweet_id', authenticated, tweetController.getTweet)

router.post('/tweets/:id/like', authenticated, userController.addLike)
router.post('/tweets/:id/unlike', authenticated, userController.removeLike)

router.post('/tweets', authenticated, tweetController.createTweet)
router.get('/tweets', authenticated, tweetController.getTweets)
// ! branch api/admin

router.get('/users/tops', authenticated, userController.getTopUsers)

router.post('/followships/:user_id', authenticated, userController.addFollowing)
router.delete('/followships/:followingId', authenticated, userController.removeFollowing)

router.get('/users/:user_id/likes', authenticated, userController.getUserLikes)
router.get('/users/:user_id/followings', authenticated, userController.getUserFollowings)
router.get('/users/:user_id/followers', authenticated, userController.getUserFollowers)
router.get('/users/:user_id/edit', authenticated, userController.editUser)
router.put('/users/:user_id', authenticated, upload.single('image'), userController.putUser)
router.get('/users/:user_id', authenticated, userController.getUser)

router.post('/users', userController.signUp)

router.post('/followships/:user_id', authenticated, userController.addFollowing)
router.delete('/followships/:followingId', authenticated, userController.removeFollowing)

router.post('/signup', userController.signUp)
router.use('/', apiErrorHandler)

module.exports = router