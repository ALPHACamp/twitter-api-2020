const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

router.get('/:id/followers', userController.getUsersFollowings)
router.get('/:id/followings', userController.getUsersFollowings)
router.get('/:id/replied_tweets', userController.getRepliedTweets)
router.get('/:id/likes', userController.getLikeTweets)
router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id', userController.getUser)
router.put('/:id', userController.putUser)

module.exports = router
