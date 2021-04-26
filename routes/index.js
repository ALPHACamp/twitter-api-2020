const users = require('./modules/users')
const admin = require('./modules/admin')
const tweets = require('./modules/tweets')
const followships = require('./modules/followships')
const { authenticated, authenticatedUser } = require('../middleware/authenticate')

module.exports = (app) => {
  app.use('/api/users', users)
  app.use('/api/admin', admin)
  app.use('/api/tweets', authenticated, authenticatedUser, tweets)
  app.use('/api/followships', authenticated, authenticatedUser, followships)
}
