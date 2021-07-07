let users = require('./api/users')
let tweets = require('./api/tweet')
let admins = require('./api/admin')

module.exports = (app) => {
  app.use('/api/users', users)
  app.use('/api/tweets', tweets)
  app.use('/api/admin', admins)
}
