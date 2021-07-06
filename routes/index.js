const users = require('./modules/users')
const admin = require('./modules/admin')

module.exports = (app) => {
  app.use('/api/users', users)
  app.use('/api/admin', admin)
}
