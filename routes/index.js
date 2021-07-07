const user = require('./user')
const tweet = require('./tweet')
const reply = require('./reply')
const followship = require('./followship')
const admin = require('./admin')
const helpers = require('../_helpers')

module.exports = (app) => {
  app.use('/api/users', user)
  app.use('/api/tweets', helpers.authenticated, helpers.authenticatedUser, tweet)
  app.use('/api/replies', helpers.authenticated, helpers.authenticatedUser, reply)
  app.use('/api/admin', helpers.authenticated, helpers.authenticatedAdmin, admin)
}