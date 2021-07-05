const user = require('./user')

module.exports = (app) => {
  app.use('/api/users', user)
}