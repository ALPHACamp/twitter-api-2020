const passport = require('../config/passport')
const express = require('express')
const router = express.Router()
const tweetController = require('../controller/api/tweetController')
const userController = require('../controller/api/userController')

//function
const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

//tweet
router.post('/tweets', authenticated, tweetController.postTweet)
router.get('/tweets', authenticated, tweetController.getTweets)
router.get('/tweets/:id', authenticated, tweetController.getTweet)
router.put('/tweets/:id', authenticated, tweetController.putTweet)
router.delete('/tweets/:id', authenticated, tweetController.deleteTweet)
//user
router.get('/users', authenticated, userController.getUsers)
router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
//JWT
router.post('/users', userController.signUp)
router.post('/users/signin', userController.signIn)
//else
router.get('/hello', (req, res) => {
  res.send('hello world123')
})

module.exports = router
