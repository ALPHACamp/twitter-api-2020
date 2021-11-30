const express = require('express')
const router = express.Router()
const tweetController = require('../controller/api/tweetController')
const userController = require('../controller/api/userController')

//tweet
router.post('/tweets', tweetController.postTweet)
router.get('/tweets', tweetController.getTweets)
router.get('/tweets/:id', tweetController.getTweet)
router.put('/tweets/:id', tweetController.putTweet)
router.delete('/tweets/:id', tweetController.deleteTweet)
//user
router.get('/users', userController.getUsers)
router.get('/users/:id', userController.getUser)
router.get('/users/:id/tweets', userController.getUserTweets)
//JWT
router.post('/users', userController.signUp)
router.post('/users/signin', userController.signIn)
//else
router.get('/hello', (req, res) => {
  res.send('hello world123')
})

module.exports = router
