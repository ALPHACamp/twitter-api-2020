const users = require('./modules/users')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')

module.exports = app => {
  app.use('/api/users', users)
}
