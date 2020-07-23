const passport = require('../config/passport')
const helpers = require('../_helpers')

const tweetController = require('../controllers/tweetController.js')

const replyController = require('../controllers/replyController.js')
const userController = require('../controllers/userController.js')


// middleware
const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (req.user.role === 'admin') return next()
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

module.exports = (app) => {
  app.get('/', authenticated, (req, res) => res.send('Hello World!')) //postman test
  app.get('/admin', authenticated, authenticatedAdmin, (req, res) => res.send('Hello Admin!')) //postman test
  app.get('/api/tweets', authenticated, tweetController.getTweets)
  app.get('/api/tweets/:id', authenticated, tweetController.getTweet)
  app.post('/api/tweets', authenticated, tweetController.postTweet)
  app.post('/api/reply', authenticated, replyController.postReply)
  app.get('/api/users/:id', authenticated, userController.getUser)
  app.get('/api/users/:id/followers', authenticated, userController.getFollowers)
  app.get('/api/users/:id/followings', authenticated, userController.getFollowings)
  app.post('/api/following/:userId', authenticated, userController.addFollowing)
  app.delete('/api/following/:userId', authenticated, userController.removeFollowing)

  app.post('/api/register', userController.register)
  app.post('/api/login', userController.login)

}