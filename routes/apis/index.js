const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')

const admin = require('./modules/admin')
const userController = require('../../controllers/user-controller')
const tweetController = require('../../controllers/tweet-controller')
const followshipController = require('../../controllers/followship-controller')

const { authenticated, authenticatedUser } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')
const upload = require('../../middleware/multer')
const { uploadFileHandler } = require('../../middleware/upload-handler')
// Admin
router.use('/admin', admin)

// Users
router.get('/users/:id/replied_tweets', authenticated, authenticatedUser, userController.getRepliedTweets)
router.get('/users/:id/tweets', authenticated, authenticatedUser, userController.getTweets)
router.get('/users/:id/likes', authenticated, authenticatedUser, userController.getLikes)
router.get('/users/:id/followings', authenticated, authenticatedUser, userController.getFollowings)
router.get('/users/:id/followers', authenticated, authenticatedUser, userController.getFollowers)
router.put('/users/:id/account', authenticated, authenticatedUser, userController.putUserSetting) // 帳戶設定
router.get('/users/:id', authenticated, authenticatedUser, userController.getUser)
router.put('/users/:id', authenticated, authenticatedUser, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'coverPhoto', maxCount: 1 }]), uploadFileHandler, userController.putUser)
router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/users', userController.signUp)

// Tweets
router.get('/tweets/:id/replies', authenticated, authenticatedUser, tweetController.getReplies)
router.post('/tweets/:id/replies', authenticated, authenticatedUser, tweetController.postReply)
router.post('/tweets/:id/like', authenticated, authenticatedUser, tweetController.likeTweet)
router.post('/tweets/:id/unlike', authenticated, authenticatedUser, tweetController.unlikeTweet)
router.get('/tweets/:id', authenticated, authenticatedUser, tweetController.getTweet)
router.post('/tweets', authenticated, authenticatedUser, tweetController.postTweet)
router.get('/tweets', authenticated, authenticatedUser, tweetController.getTweets)

// Followship
router.get('/followships/top', authenticated, authenticatedUser, followshipController.getTopFollowship)
router.delete('/followships/:followingId', authenticated, authenticatedUser, followshipController.removeFollowing)
router.post('/followships', authenticated, authenticatedUser, followshipController.addFollowing)

router.use('/', apiErrorHandler)

module.exports = router
