const express = require('express')
const router = express.Router()
const userController = require('../../../controllers/user-controller')

router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id/replied_tweets', userController.getUserReplies)
router.get('/:id/likes', userController.getUserLikes)
router.get('/:id/followings', userController.getUserFollowings)
router.get('/:id', userController.getUser)
router.get('/:id/tweets')
router.get('/', userController.getUsers)

module.exports = router
