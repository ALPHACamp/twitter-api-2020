const user = require('./user')
const tweet = require('./tweet')

module.exports = (app) => {
  app.use('/api/users', user)
  app.use('/api/tweets', tweet)
}