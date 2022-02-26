const express = require('express')
const passport = require('passport')
const router = express.Router()
const { apiErrorHandler } = require('../../middleware/error-handlers')
const userController = require('../../controllers/apis/user-controller')
const adminController = require('../../controllers/apis/admin-controller')
const tweetController = require('../../controllers/apis/tweet-controller')
const followController = require('../../controllers/apis/follow-controller')
const upload = require('../../middleware/multer')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../../middleware/apiAuth')
const uploadFields = [
  { name: 'avatar', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]

router.post('/tweets/:id/like', authenticated, authenticatedUser, tweetController.addLike)
router.post('/tweets/:id/unlike', authenticated, authenticatedUser, tweetController.removeLike)
router.post('/tweets/:id/replies', authenticated, authenticatedUser, tweetController.postReply)
router.get('/tweets/:id/replies', authenticated, authenticatedUser, tweetController.getReplies)
router.get('/tweets/:id', authenticated, authenticatedUser, tweetController.getTweet)
router.post('/tweets', authenticated, authenticatedUser, tweetController.postTweet)
router.get('/tweets', authenticated, authenticatedUser, tweetController.getTweets)
router.delete('/followships/:followingId', authenticated, authenticatedUser, followController.deleteFollowing)
router.post('/followships', authenticated, authenticatedUser, followController.postFollowing)
router.get('/users/:id/tweets', authenticated, authenticatedUser, userController.getTweets)
router.get('/users/:id/replied_tweets', authenticated, authenticatedUser, userController.getReplies)
router.get('/users/:id/likes', authenticated, authenticatedUser, userController.getLikes)

router.get('/users/:id/followings', authenticated, authenticatedUser, userController.getUserFollowings)
router.get('/users/:id/followers', authenticated, authenticatedUser, userController.getUserFollowers)

router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.put('/users/:id/account', authenticated, authenticatedUser, userController.putUserAccount)
router.put('/users/:id', authenticated, authenticatedUser, upload.fields(uploadFields), userController.putUser)
router.post('/users', userController.signUp)
router.delete('/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)
router.get('/admin/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.post('/admin/signin', passport.authenticate('local', { session: false }), adminController.signIn)

router.use('/', apiErrorHandler)

module.exports = router
