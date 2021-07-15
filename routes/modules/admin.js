const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/adminController')

router.get('/users', adminController.getUsers)
router.delete('/tweets/:id', adminController.deleteTweet)
router.get('/tweets', adminController.getTweets)


router.get('/users/:id', adminController.getUser)
router.get('/users/:id/tweets', adminController.getUserTweets)
router.get('/users/:id/likes', adminController.getUserLikes)
router.get('/users/:id/followings', adminController.getUserFollowings)
router.get('/users/:id/followers', adminController.getUserFollowers)
router.get('/users/:id/replied_tweets', adminController.getUserRepliedTweets)

module.exports = router
