const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

router.get('/:id/followers', userController.getUserFollowers)
router.get('/:id/followings', userController.getUserFollowings)
router.get('/:id/likes', userController.getUserLikedTeets)
router.get('/:id/replied_tweets', userController.getUserReplies)
router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id', userController.getUserProfile)

module.exports = router
