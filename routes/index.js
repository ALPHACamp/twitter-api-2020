const users = require('./apis/users')
const admin = require('./apis/admin')
const tweets = require('./apis/tweets')
const followships = require('./apis/followships')

// const authenticated...
// TODO:登入權限還未加入

module.exports = app => {
  app.use('/api/users', users)
  app.use('/api/admin', admin)
  app.use('/api/tweets', tweets)
  app.use('/api/followships', followships)
}