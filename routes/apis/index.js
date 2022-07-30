const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')
const userController = require('../../controllers/apis/user-controller')
const tweetController = require('../../controllers/apis/tweet-controller')
const adminController = require('../../controllers/apis/admin-controller')

const { authenticated, authenticatedOwner, authenticatedAdmin } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')
const upload = require('../../middleware/multer')

router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)

router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:id/replied_tweets', authenticated, userController.getUserReplies)
router.get('/users/:id/likes', authenticated, userController.getUserLikes)
router.get('/users/:id/followings', authenticated, userController.getUserFollowings)
router.get('/users/:id/followers', authenticated, userController.getUserFollowers)

router.get('/users/top', authenticated, userController.getTopUsers)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id',
  upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]),
  authenticatedOwner,
  userController.putUser)

router.post('/users', userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)

router.delete('/followships/:followingId', authenticated, userController.removeFollowing)
router.post('/followships', authenticated, userController.addFollowing)

router.get('/tweets', authenticated, tweetController.getTweets)
router.get('/tweets/:id', authenticated, tweetController.getTweet)

router.get('/tweets/:tweet_id/replies', authenticated, userController.getReplies)
router.post('/tweets/:tweet_id/replies', authenticated, userController.addReply)

router.post('/tweets/:id/like', authenticated, userController.addLike)
router.post('/tweets/:id/unlike', authenticated, userController.unLike)
router.post('/tweets', authenticated, tweetController.postTweet)

router.get('/get_current_user', authenticated, userController.getCurrentUser)
router.get('/tweets/:id', authenticated, tweetController.getTweet)
router.get('/tweets', authenticated, tweetController.getTweets)

router.use('/', apiErrorHandler)

module.exports = router
