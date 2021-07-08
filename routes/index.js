const users = require('./modules/users')
const followships = require('./modules/followships')
const admin = require('./modules/admin')
const tweets = require('./modules/tweets')


module.exports = (app) => {

  app.use('/api/users', users)
  app.use('/api/admin', admin)
  app.use('/api/tweets', tweets)
  app.use('/api/followships', followships)
}
