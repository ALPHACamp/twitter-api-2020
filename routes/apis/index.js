const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')
const userController = require('../../controllers/apis/user-controller')

const { authenticated, authenticatedOwner } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')

router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticatedOwner, userController.putUser)
router.post('/users', userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:id/replied_tweets', authenticated, userController.getUserReplies)
router.get('/users/:id/likes', authenticated, userController.getUserLikes)
router.get('/users/:id/followings', authenticated, userController.getUserFollowings)
router.get('/users/:id/followers', authenticated, userController.getUserFollowers)
router.post('/followships/:followingId', authenticated, userController.addFollowing)
router.use('/', apiErrorHandler)

module.exports = router
