const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const passport = require('../config/passport')
const helpers = require('../_helpers')

function authenticated(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' })
    }
    req.user = user // JWT 沒有使用 session，所以需要手動設置
    return next()
  })(req, res, next)
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).role === 'admin') {
      return next()
    }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

const authenticatedNotAdmin = (req, res, next) => {
  if (helpers.getUser(req).role === 'admin') {
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return next()
  }
}

module.exports = (app) => {
  app.get('/', (req, res) => res.send('Hello World!'))
  app.post('/api/users', userController.signUp)
  app.post('/signin', userController.signIn)

  app.post('/signin/admin', adminController.signIn)
  // admin
  app.get('/api/admin/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
  app.get('/api/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
  // users
  app.get('/api/users/:userId', authenticated, authenticatedNotAdmin, userController.getUser)
  app.get('/api/users/:userId/tweets', authenticated, authenticatedNotAdmin, userController.getUserTweets)
  app.get('/api/users/:userId/replied_tweets', authenticated, authenticatedNotAdmin, userController.getAllReplies)
  // app.put('/users/:userId/edit')
  // app.get('/users/:userId/likes')
  // app.get('/users/:userId/followers')
  // app.get('/users/:userId/followings')
  // app.post('/users/:userId/follow')
  // app.delete('/users/:userId/follow')
  // // tweets
  // app.get('/tweets')
  // app.get('/tweets/:tweetId')
  // app.post('/tweets')
  // app.post('/tweets/:tweetId/replies')
  // app.put('/tweets/:tweetId')
  // app.delete('/tweets/:tweetId')
  // app.post('/tweets/:tweetId/like')
  // app.delete('/tweets/:tweetId/like')
  // // replies
  // app.post('/replies/:replyId/like')
  // app.delete('/replies/:replyId/like')
}
