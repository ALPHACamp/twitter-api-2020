const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/adminController')

router.get('/users', adminController.getUsers)
router.delete('/tweets/:id', adminController.deleteTweet)
router.get('/tweets', adminController.getTweets)


router.get('/users/:id', adminController.getUser)
router.get('/users/:id/tweets', adminController.getUserTweets)
router.get('/users/:id/likes', adminController.getUserLikes)

module.exports = router
