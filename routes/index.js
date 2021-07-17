const users = require('./modules/users')
const followships = require('./modules/followships')
const admin = require('./modules/admin')
const tweets = require('./modules/tweets')
const chat = require('./modules/chat')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')
module.exports = (app) => {
  app.use('/api/users', users)
  app.use('/api/admin', authenticated, authenticatedAdmin, admin)
  app.use('/api/tweets', authenticated, tweets)
  app.use('/api/followships', authenticated, authenticatedUser, followships)
  app.use('/api/chat', authenticated, chat)
}
