const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')

router.get('/:user_id/replied_tweets', userController.getRepliesOfTweet)
router.get('/:user_id/tweets', userController.getTweetsOfUser)
router.get('/:user_id/likes', userController.getLikesOfUser)
router.get('/:user_id/followings', userController.getFollowingsOfUser)
router.get('/:user_id/followers', userController.getFollowersOfUser)
router.get('/:user_id', userController.getUser)

module.exports = router
