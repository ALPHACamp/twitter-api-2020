const express = require('express')
const router = express.Router()
const { authenticatedUser } = require('../../middleware/auth')
const userController = require('../../controllers/user-controller')
router.get('/:userId/followers', authenticatedUser, userController.getUserFollowers)


router.get('/:userId/tweets', authenticatedUser, userController.getUserTweets)
router.get(
<<<<<<< HEAD
  '/:userId/replied_tweets',
  authenticatedUser,
  userController.getUserReplies
)


=======
  '/:userId/replied_tweets', authenticatedUser, userController.getUserReplies)
router.get('/:userId/followings', authenticatedUser, userController.getUserFollowings)
router.get("/:userId", authenticatedUser, userController.getUser);
>>>>>>> master
router.post('/', userController.signUp)

module.exports = router
