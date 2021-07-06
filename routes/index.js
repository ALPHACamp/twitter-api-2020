const user = require('./user')
const tweet = require('./tweet')
const reply = require('./reply')

module.exports = (app) => {
  app.use('/api/users', user)
  app.use('/api/tweets', tweet)
  app.use('/api/replies', reply)
}