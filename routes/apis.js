const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/api/userController')
const adminController = require('../controllers/api/adminController')
const followshipController = require('../controllers/api/followshipController')
const tweetController = require('../controllers/api/tweetController')
const { registerRules, loginRules, profileRules, postTweetRules, validResultCheck } = require('../middleware/validator')
const { authenticate } = require('../config/passport')

// wrap passport authenticate method to pass mocha test
function authenticated(req, res, next) {
  passport.authenticate('jwt', { session: false }, (error, user, info) => {
    if (error) return next(error)
    if (!user) return res.status(401).json({ status: 'error', message: 'UnAuthorized' })
    req.user = user
    return next()
  })(req, res, next)
}

router.post('/admin/signin', adminController.signIn)
router.get('/admin/tweets', adminController.getTweets)
router.delete('/admin/tweets/:id', adminController.deleteTweet)
router.get('/admin/users', adminController.getUsers)

router.post('/users', registerRules(), validResultCheck, userController.signUp)
router.post('/signin', loginRules(), validResultCheck, userController.signIn)

router.get('/users/:id/tweets', authenticated, userController.getTweets)
router.get('/users/:id/likes', authenticated, userController.getLikeTweets)
router.get('/users/:id/followers', authenticated, userController.getFollowers)
router.get('/users/:id/followings', authenticated, userController.getFollowings)
router.get('/users/:id/replied_tweets', authenticated, userController.getRepliedTweets)
router.put('/users/:id', authenticated, profileRules(), validResultCheck, userController.updateProfile)
router.get('/users/:id', authenticated, userController.getUser)
router.get('/users', authenticated, userController.getUsers)

router.delete('/followships/:followingId', authenticate, followshipController.deleteFollowing)
router.post('/followships', authenticate, followshipController.addFollowing)

router.post('/tweets/:id/replies', authenticate, tweetController.replyTweet)
router.get('/tweets/:id/replies', authenticate, tweetController.getReplies)
router.post('/tweets/:id/like', authenticate, tweetController.likeTweet)
router.post('/tweets/:id/unlike', authenticate, tweetController.unlikeTweet)
router.get('/tweets/:id', authenticate, tweetController.getTweet)
router.post('/tweets', authenticate, postTweetRules(), validResultCheck, tweetController.postTweet)
router.get('/tweets', authenticate, tweetController.getTweets)

module.exports = router