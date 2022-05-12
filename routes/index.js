const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const userController = require('../controllers/user-controller')
const { authenticated } = require('../middleware/auth')
const { errorHandler } = require('../middleware/error-handler')

router.post('/api/login', passport.authenticate('local', { session: false }), userController.login)
router.post('/api/users', userController.signUp)
router.get('/api/users/:id', authenticated, userController.getUser)
router.get('/api/users/:id/tweets', authenticated, userController.getUserTweet)
router.get('/api/users/:id/replied_tweets', authenticated, userController.userRepliedTweets)
// router.get('/api/users/:id/likes', userController.userLike)
// router.get('/api/user/:id/followings')
// router.get('/api/user/:id/followers')
// router.put('/api/users/:id', userController.putUser)
router.use('/', errorHandler)

module.exports = router
