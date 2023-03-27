const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const { authenticatedUser } = require('../../middleware/auth')
const userController = require('../../controllers/user-controller')

router.post('/signin', passport.authenticate('user-local', { session: false }), userController.signIn)
router.post('/', userController.signUp)

router.use(authenticatedUser)

router.get('/:userId/tweets', userController.getUserTweets)
router.get(
  '/:userId/replied_tweets', userController.getUserReplies)
router.get('/:userId/followings', userController.getUserFollowings)
router.get('/:userId/followers', userController.getUserFollowers)
router.get('/:userId', userController.getUser)

module.exports = router
