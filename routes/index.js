const auth = require('./auth')
const admin = require('./admin')
const users = require('./users')
const tweets = require('./tweets')
const followships = require('./followships')

module.exports = (app) => {
  app.use('/api', auth)
  app.use('/api/admin', admin)
  app.use('/api/users/:id', users)
  app.use('/api/tweets', tweets)
  app.use('/api/followships', followships)
}