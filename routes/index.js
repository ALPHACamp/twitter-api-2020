const users = require('./modules/users')
const tweets = require('./modules/tweets')

module.exports = (app) => {
  app.use('/api/users', users)
  app.use('/api/tweets', tweets)
}
