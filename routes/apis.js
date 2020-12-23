const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const userController = require('../controllers/api/userController')
const adminController = require('../controllers/api/adminController')
const followshipController = require('../controllers/api/followshipController')
const tweetController = require('../controllers/api/tweetController')
const { registerRules, loginRules, profileRules, postTweetRules, UserRules, validResultCheck } = require('../middleware/validator')
const helpers = require('../_helpers.js')

// wrap passport authenticate method to pass mocha test
function authenticated(req, res, next) {
  passport.authenticate('jwt', { session: false }, (error, user, info) => {
    if (error) return next(error)
    if (!user) return res.status(401).json({ status: 'error', message: '未被授權' })
    req.user = user
    return next()
  })(req, res, next)
}

function userAuthenticated(req, res, next) {
  if (helpers.getUser(req).role === 'admin') return res.status(401).json({ status: 'error', message: '未被授權' })
  return next()
}

function adminAuthenticated(req, res, next) {
  if (helpers.getUser(req).role !== 'admin') return res.status(401).json({ status: 'error', message: '未被授權' })
  return next()
}

router.post('/admin/signin', loginRules(), validResultCheck, adminController.signIn)
router.get('/admin/tweets', authenticated, adminAuthenticated, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticated, adminAuthenticated, adminController.deleteTweet)
router.get('/admin/users', authenticated, adminAuthenticated, adminController.getUsers)

router.post('/users', registerRules(), validResultCheck, userController.signUp)
router.post('/signin', loginRules(), validResultCheck, userController.signIn)

router.get('/users/:id/tweets', authenticated, userAuthenticated, UserRules(), validResultCheck, userController.getTweets)
router.get('/users/:id/likes', authenticated, userAuthenticated, UserRules(), validResultCheck, userController.getLikeTweets)
router.get('/users/:id/followers', authenticated, userAuthenticated, UserRules(), validResultCheck, userController.getFollowers)
router.get('/users/:id/followings', authenticated, userAuthenticated, UserRules(), validResultCheck, userController.getFollowings)
router.get('/users/:id/replied_tweets', authenticated, userAuthenticated, UserRules(), validResultCheck, userController.getRepliedTweets)
router.put('/users/:id', authenticated, userAuthenticated, UserRules(), validResultCheck, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), profileRules, validResultCheck, userController.updateProfile)
router.get('/users/:id', authenticated, userAuthenticated, UserRules(), validResultCheck, userController.getUser)
router.get('/users', authenticated, userAuthenticated, userController.getUsers)

router.delete('/followships/:followingId', authenticated, followshipController.deleteFollowing)
router.post('/followships', authenticated, followshipController.addFollowing)

router.post('/tweets/:id/replies', authenticated, userAuthenticated, tweetController.replyTweet)
router.get('/tweets/:id/replies', authenticated, userAuthenticated, tweetController.getReplies)
router.post('/tweets/:id/like', authenticated, userAuthenticated, tweetController.likeTweet)
router.post('/tweets/:id/unlike', authenticated, userAuthenticated, tweetController.unlikeTweet)
router.get('/tweets/:id', authenticated, userAuthenticated, tweetController.getTweet)
router.post('/tweets', authenticated, userAuthenticated, postTweetRules(), validResultCheck, tweetController.postTweet)
router.get('/tweets', authenticated, userAuthenticated, tweetController.getTweets)

module.exports = router