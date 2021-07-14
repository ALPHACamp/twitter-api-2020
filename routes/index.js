const user = require('./user')
const tweet = require('./tweet')
const reply = require('./reply')
const followship = require('./followship')
const admin = require('./admin')
const currentUser = require('./currentUser')
const helpers = require('../_helpers')

module.exports = (app) => {
  app.use('/api/users', user)
  app.use('/api/tweets', helpers.authenticated, tweet)
  app.use('/api/replies', helpers.authenticated, reply)
  app.use('/api/admin', admin)
  app.use('/api/followships', helpers.authenticated, followship)
  app.use('/api/currentUser', helpers.authenticated, currentUser)
}