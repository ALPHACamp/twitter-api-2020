const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const userController = require('../controllers/api/userController')
const adminController = require('../controllers/api/adminController')
const followshipController = require('../controllers/api/followshipController')
const tweetController = require('../controllers/api/tweetController')
const { registerRules, loginRules, profileRules, postTweetRules, userRules } = require('../middleware/validator')
const helpers = require('../_helpers.js')

// wrap passport authenticate method to pass mocha test
function authenticated(req, res, next) {
  passport.authenticate('jwt', { session: false }, (error, user, info) => {

    if (error) return next(error)
    if (!user) return res.status(401).json({ status: 'error', message: '未被授權' })
    if (req.method !== 'GET' && user.id !== req.params.id) return res.status(401).json({ status: 'error', message: '您無權限修改他人資料' })

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

router.post('/admin/signin', loginRules, adminController.signIn)
router.get('/admin/tweets', authenticated, adminAuthenticated, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticated, adminAuthenticated, adminController.deleteTweet)
router.get('/admin/users', authenticated, adminAuthenticated, adminController.getUsers)

router.post('/users', registerRules, userController.signUp)
router.post('/signin', loginRules, userController.signIn)

router.get('/users/currentUser', authenticated, userAuthenticated, userController.getCurrentUser)
router.get('/users/:id/tweets', authenticated, userAuthenticated, userRules, userController.getTweets)
router.get('/users/:id/likes', authenticated, userAuthenticated, userRules, userController.getLikeTweets)
router.get('/users/:id/followers', authenticated, userAuthenticated, userRules, userController.getFollowers)
router.get('/users/:id/followings', authenticated, userAuthenticated, userRules, userController.getFollowings)
router.get('/users/:id/replied_tweets', authenticated, userAuthenticated, userRules, userController.getRepliedTweets)
router.put('/users/:id', authenticated, userAuthenticated, userRules, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), profileRules, userController.updateProfile)
router.get('/users/:id', authenticated, userAuthenticated, userRules, userController.getUser)
router.get('/users', authenticated, userAuthenticated, userController.getUsers)

router.delete('/followships/:followingId', authenticated, followshipController.deleteFollowing)
router.post('/followships', authenticated, followshipController.addFollowing)

router.post('/tweets/:id/replies', authenticated, userAuthenticated, tweetController.replyTweet)
router.get('/tweets/:id/replies', authenticated, userAuthenticated, tweetController.getReplies)
router.post('/tweets/:id/like', authenticated, userAuthenticated, tweetController.likeTweet)
router.post('/tweets/:id/unlike', authenticated, userAuthenticated, tweetController.unlikeTweet)
router.get('/tweets/:id', authenticated, userAuthenticated, tweetController.getTweet)
router.post('/tweets', authenticated, userAuthenticated, postTweetRules, tweetController.postTweet)
router.get('/tweets', authenticated, userAuthenticated, tweetController.getTweets)

module.exports = router