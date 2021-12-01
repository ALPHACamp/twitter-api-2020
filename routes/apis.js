const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const tweetController = require('../controllers/tweetController')

// const multer = require('multer')
// const upload = multer({ dest: 'temp/' })

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'No jwt token'
      })
    }
    req.user = user
    return next()
  })(req, res, next)
}

const authenticatedUser = (req, res, next) => {
  if (req.user && req.user.role === 'user') return next()
  return res.status(401).json({
    status: 'error',
    message: 'permission denied'
  })
}

const authenticatedAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next()
  return res.status(401).json({
    status: 'error',
    message: 'permission denied'
  })
}

router.get('/', authenticated, authenticatedUser, (req, res) => res.send('test'))

//user
router.post('/users', userController.signUP)
router.post('/signin', userController.signIn)
router.get('/users/:id/tweets', authenticated, authenticatedUser, userController.getTweets)
router.get('/users/:id', authenticated, authenticatedUser, userController.getUser)
router.get('/users/:id/replied_tweets', authenticated, authenticatedUser, userController.getRepliedTweets)
router.get('/users/:id/likes', authenticated, authenticatedUser, userController.getLikes)


//tweet
router.get('/tweets', authenticated,authenticatedUser, tweetController.getTweets)
router.post('/tweets', authenticated,authenticatedUser,tweetController.postTweet)
router.get('/tweets/:tweet_id', authenticated,authenticatedUser, tweetController.getTweet)
router.post('/tweets/:id/unlike', authenticated,authenticatedUser, tweetController.unlikeTweet)
router.post('/tweets/:id/like', authenticated,authenticatedUser, tweetController.likeTweet)

//admin
router.post('/admin/signin', adminController.signIn)
router.get('/admin', authenticated, authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)

module.exports = router