const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/adminController')
const tweetController = require('../../controllers/tweetController')
const userController = require('../../controllers/userController')

router.post('/signin', userController.signIn)
router.get('/tweets', tweetController.getTweets)
router.delete('/tweets/:tweet_id', adminController.deleteTweet)
router.get('/users', adminController.getUsers)

module.exports = router
