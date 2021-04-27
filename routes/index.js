const users = require('./modules/users')
const admin = require('./modules/admin')
const tweets = require('./modules/tweets')
const followships = require('./modules/followships')
const subscriptions = require('./modules/subscriptions')
const swagger = require('./modules/swagger')

const {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
} = require('../middleware/auth')

module.exports = app => {
  app.use('/api-docs', swagger)
  app.use('/api/users', users)
  app.use('/api/admin', authenticated, authenticatedAdmin, admin)
  app.use('/api/tweets', authenticated, tweets)
  app.use('/api/followships', authenticated, authenticatedUser, followships)
  app.use('/api/subscriptions', authenticated, authenticatedUser, subscriptions)
}
