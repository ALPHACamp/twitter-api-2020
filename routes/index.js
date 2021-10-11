const user = require('./user')
const tweet = require('./tweet')
const followship = require('./followship')
const admin = require('./admin')
const { authenticated, authenticatedUser, authenticatedAdmin } = require('../middlewares/auth')
const userController = require('../controllers/userController')
const subscribeship = require('./subscribeship')
const message = require('./message')

module.exports = (app) => {
  app.use('/api/users', user)
  app.post('/api/login', userController.login)
  app.use('/api/tweets', authenticated, authenticatedUser, tweet)
  app.use('/api/followships', authenticated, authenticatedUser, followship)
  app.use('/api/subscribeships', authenticated, authenticatedUser, subscribeship)
  app.use('/api/admin', authenticated, authenticatedAdmin, admin)
  app.use('/api/messages', authenticated, authenticatedUser, message)
}