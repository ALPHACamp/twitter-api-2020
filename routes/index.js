const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const followController = require('../controllers/followController')
const adminController = require('../controllers/adminController')
const likeController = require('../controllers/likeController')
const passport = require('../config/passport')
const helpers = require('../_helpers')
const multer = require('multer')
const replyController = require('../controllers/replyController')
const upload = multer({ dest: 'temp/' })

// use helpers.getUser(req) to replace req.user
// 驗前台是user身分
const authenticatedUser = (req, res, next) => {
  if (helpers.getUser(req).role === 'admin') {
    return res.status(401).json({ status: 'error', message: '帳號不存在！' })
  }
  return next()
}

// 驗後台身分
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req).role === 'user') {
    return res.status(401).json({ status: 'error', message: '帳號不存在！' })
  }
  return next()
}

// 登入token驗證
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, user, info) => {
    if (error) {
      return next(error)
    }
    if (!user) {
      return res.status(401).json({ status: 'error', message: '帳號不存在！' })
    }
    req.user = user
    return next()
  })(req, res, next)
}

module.exports = (app) => {
  // JWT signin & signup
  app.post('/api/users', userController.signUp)
  app.post('/api/users/signin', userController.signIn)
  // users routes
  app.get(
    '/api/users/:id',
    authenticated,
    authenticatedUser,
    userController.getUser
  )

  app.put(
    '/api/users/:id',
    authenticated,
    authenticatedUser,
    upload.fields([
      { name: 'avatar', maxCount: 1 },
      { name: 'cover', maxCount: 1 }
    ]),
    userController.putUser
  )

  // replies
  app.post('/api/tweets/:tweet_id/replies', authenticated, authenticatedUser, replyController.postReply)

  // tweets
  app.get(
    '/api/users/:id/tweets',
    authenticated,
    authenticatedUser,
    userController.getUsersTweets
  )
  app.get('/api/tweets', authenticated, authenticatedUser, tweetController.getTweets)
  app.get('/api/tweets/:tweet_id', authenticated, authenticatedUser, tweetController.getTweet)
  app.post('/api/tweets', authenticated, authenticatedUser, tweetController.postTweet)

  // followship
  app.get('/api/followships/top', authenticated, authenticatedUser, followController.getTopUser)

  // like
  app.post('/api/tweets/:id/like', authenticated, authenticatedUser, likeController.likeTweet)

  // admin
  app.get('/api/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
  app.delete('/api/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)
}
