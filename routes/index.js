const user = require('./user')
const tweet = require('./tweet')
const followship = require('./followship')
const admin = require('./admin')
const helpers = require('../_helpers')

module.exports = (app) => {
  app.use('/api/users', user)
  app.use('/api/tweets', helpers.authenticated, helpers.authenticatedUser, tweet)
  app.use('/api/admin', helpers.authenticated, helpers.authenticatedAdmin, admin)
  app.use('/api/followships', helpers.authenticated, helpers.authenticatedUser, followship)
}

// helpers.authenticated, helpers.authenticatedUser,