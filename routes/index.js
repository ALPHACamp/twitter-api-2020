const passport = require('../config/passport')
const helpers = require('../_helpers')

const tweetController = require('../controllers/tweetController.js')
const userController = require('../controllers/userController')

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
  app.get('/api/tweets/:id', tweetController.getTweet)
  app.post('/api/tweets', tweetController.postTweet)

  app.post('/api/register', userController.register)
  app.post('/api/login', userController.login)
}