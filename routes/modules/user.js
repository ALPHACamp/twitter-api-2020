const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const { authenticatedUser } = require('../../middleware/auth')
const userController = require('../../controllers/user-controller')

router.get('/:userId/tweets', authenticatedUser, userController.getUserTweets)
router.get(
  '/:userId/replied_tweets', authenticatedUser, userController.getUserReplies)

router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)

router.post('/', userController.signUp)

module.exports = router
