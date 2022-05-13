const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

router.get('/:id', userController.getUser)
router.get('/:id/tweets', userController.getTweets)
router.get('/:id/replied_tweets', userController.getRepliedTweets)
router.get('/:id/likes', userController.getLikes)
router.get('/:id/followings', userController.getFollowings)

module.exports = router
