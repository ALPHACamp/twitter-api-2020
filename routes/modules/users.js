const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controllers')

router.get('/:id', userController.getUser)
router.put('/:id', userController.putUser)
router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id/replied_tweets', userController.getUserRepliedTweet)
router.get('/:id/likes', userController.getUserLikes)
router.get('/:id/followings', userController.getUserFollowings)
router.get('/:id/followers', userController.getUserFollowers)

module.exports = router
