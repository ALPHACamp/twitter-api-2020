const users = require('./modules/users')
const admin = require('./modules/admin')
const tweets = require('./modules/tweets')
const followships = require('./modules/followships')
const subscriptions = require('./modules/subscriptions')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')

module.exports = app => {
  app.use('/api/users', users)
  app.use('/api/admin', authenticated, authenticatedAdmin, admin)
  app.use('/api/tweets', authenticated, tweets)
  app.use('/api/followships', authenticated, followships)
  app.use('/api/subscriptions', authenticated, subscriptions)
}
