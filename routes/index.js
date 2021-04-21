const apiAdmins = require('./apiAdmins')
const apis = require('./apis')

module.exports = app => {
  app.use('/api/admin', apiAdmins)
  app.use('/api', apis)

}
