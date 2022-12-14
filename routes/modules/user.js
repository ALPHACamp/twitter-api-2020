const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
router.get('/:userId/followings', userController.getUserFollowings)
router.get('/:userId/followers', userController.getUserFollowers)
router.get('/followship', userController.getTopUsers)
router.get('/:userId/tweets', userController.getUserTweets)
router.get('/:userId/replied_tweets', userController.getUserReplies)
router.get('/:userId/likes', userController.getLikedTweets)
router.put('/:userId', userController.editUser)
router.get('/:userId', userController.getUser)
router.get('/', userController.getUsers)

module.exports = router
