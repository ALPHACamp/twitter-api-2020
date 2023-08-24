const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const admin = require('./modules/admin')
const userController = require('../../controllers/user-controller')
const tweetController = require('../../controllers/tweet-controller')
const followshipController = require('../../controllers/followship-controller')

// router.use('/admin', admin)

// router.get('/users/:id/tweets', userController)
// router.get('/users/:id/replied_tweets', userController)
// router.get('/users/:id/likes', userController)
// router.get('/users/:id/followers', userController)
// router.get('/users/:id/followings', userController)
// router.put('/users/:id/account', userController)
// router.get('/users/:id', userController)
// router.put('/users/:id', userController)
// router.get('/users/top', userController)
// router.post('/login', userController)
// router.post('/users', userController)

// router.get('/tweets/:tweetId/replies', tweetController)
// router.post('/tweets/:tweetId/replies', tweetController)
// router.post('/tweets/:id/like', tweetController)
// router.post('/tweets/:id/unlike', tweetController)
// router.get('/tweets/:id', tweetController)
// router.post('/tweets', tweetController)
// router.get('/tweets', tweetController)

// router.post('/followships', followshipController)
// router.delete('/followships/:followingId', followshipController)

module.exports = router
