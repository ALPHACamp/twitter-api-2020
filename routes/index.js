const user = require('./user')
const tweet = require('./tweet')
const followship = require('./followship')
const admin = require('./admin')

module.exports = (app) => {
  app.use('/api/users', user)
  app.use('/api/tweets', tweet)
  app.use('/api/admin', admin)
}