const users = require('./modules/users')
const admin = require('./modules/admin')
const tweets = require('./modules/tweets')
const userProfiles = require('./modules/userProfiles')

module.exports = (app) => {
  app.use('/api/users', users)
  app.use('/api/tweets', tweets)
  app.use('/api/admin', admin)
  app.use('/users', userProfiles)
}
