const express = require('express')
const router = express.Router()
const userController = require('../../../controllers/apis/user-controller')

router.get('/:userId/followings', userController.getFollowingsOfUser)
router.get('/:userId/replied_tweets', userController.getRepliesOfUser)
router.get('/:userId/followers', userController.getFollowersOfUser)
router.get('/:userId/likes', userController.getLikesOfUser)
router.get('/:userId/tweets', userController.getTweetsOfUser)
router.get('/:userId', userController.getUser)

module.exports = router
