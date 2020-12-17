const auth = require('./auth')
const admin = require('./admin')
const users = require('./users')
const tweets = require('./tweets')
const followships = require('./followships')

const { authenticate, authAdmin, authUser } = require('../middleware/auth')

module.exports = (app) => {
  app.use('/api', auth)
  app.use('/api/admin', authenticate, authAdmin, admin)
  app.use('/api/users/:id', authenticate, authUser, users)
  app.use('/api/tweets', authenticate, authUser, tweets)
  app.use('/api/followships', authenticate, authUser, followships)
}