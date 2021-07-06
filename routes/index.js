const user = require('./user')
const tweet = require('./tweet')
const followship = require('./followship')

module.exports = (app) => {
  app.use('/api/users', user)
  app.use('/api/tweets', tweet)
  app.use('/api/followships', followship)
}