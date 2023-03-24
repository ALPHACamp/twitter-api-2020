const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const { authenticatedUser } = require('../../middleware/auth')
const userController = require('../../controllers/user-controller')

router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.get(
  "/:userId/replied_tweets",
  authenticatedUser,
  userController.getRepliedTweets
);
router.get('/:userId/likes', authenticatedUser, userController.getUserLikes)
router.post('/', userController.signUp)

module.exports = router
