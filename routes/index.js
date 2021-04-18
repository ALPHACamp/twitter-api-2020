const apiAdmins = require('./apiAdmins')

module.exports = app => {
  app.use('/api/admin', apiAdmins)
}
