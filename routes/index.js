const users = require('./modules/users')
module.exports = (app) => {
  app.use('/api/users', users)
}
