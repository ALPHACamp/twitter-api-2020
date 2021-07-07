const user = require('./user')
const tweet = require('./tweet')
const reply = require('./reply')
const helpers = require('../_helpers')

module.exports = (app) => {
  app.use('/api/users', helpers.authenticated, helpers.authenticatedUser, user)
  app.use('/api/tweets', helpers.authenticated, helpers.authenticatedUser, tweet)
  app.use('/api/replies', helpers.authenticated, helpers.authenticatedUser, reply)
}