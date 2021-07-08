const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')
const { authenticated } = require('../../middleware/auth')

router.get('/tweets', userController.getUserTweets)
router.get('/replied_tweets', userController.getUserReplies)
router.get('/likes', userController.getUserLikes)
router.get('/followings', userController.getUserFollowings)
router.get('/followers', userController.getUserFollowers)


//router.use(authenticated)

module.exports = router
