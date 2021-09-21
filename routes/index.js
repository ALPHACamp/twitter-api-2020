const users = require('./apis/users')
const admin = require('./apis/admin')
const tweets = require('./apis/tweets')
const followships = require('./apis/followships')
const cors = require('cors')


module.exports = app => {
  app.use('/api/users', cors(), users)
  app.use('/api/admin', cors(), admin)
  app.use('/api/tweets', cors(), tweets)
  app.use('/api/followships', cors(), followships)
}