const apiAdmins = require('./apiAdmins')

module.exports = app => {
  app.get('/', (req, res) => res.send('Hello'))
  app.use('/api/admin', apiAdmins)
}
