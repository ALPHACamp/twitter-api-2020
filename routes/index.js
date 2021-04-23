const users = require('./modules/users')
const admin = require('./modules/admin')
const followships = require('./modules/followships')
const { authenticated, authenticatedUser } = require('../middleware/authenticate')

module.exports = (app) => {
  app.use('/api/users', users)
  app.use('/api/admin', admin)
  app.use('/api/followships', authenticated, authenticatedUser, followships)
}
