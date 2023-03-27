const express = require('express')
const router = express.Router()
const { authenticatedUser } = require('../../middleware/auth')
const userController = require('../../controllers/user-controller')
router.get('/:userId/followers', authenticatedUser, userController.getFollowers)

router.get('/:userId', authenticatedUser, userController.getUser)
router.get('/:userId/tweets', authenticatedUser, userController.getUserTweets)
router.get(
  '/:userId/replied_tweets',
  authenticatedUser,
  userController.getUserReplies
)


router.post('/', userController.signUp)

module.exports = router
