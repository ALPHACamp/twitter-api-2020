const auth = require('./auth')
const admin = require('./admin')
const users = require('./users')
const tweets = require('./tweets')
const followships = require('./followships')

const { authenticated, authAdmin, authUser } = require('../middleware/auth')

module.exports = (app) => {
  app.use('/api', auth)
  app.use('/api/admin', authenticated, authAdmin, admin)
  app.use('/api/users/:id', authenticated, authUser, users)
  app.use('/api/tweets', authenticated, authUser, tweets)
  app.use('/api/followships', authenticated, authUser, followships)
}