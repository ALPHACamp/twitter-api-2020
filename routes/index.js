const users = require('./modules/users')
const followships = require('./modules/followships')

module.exports = (app) => {
  app.use('/api/users', users)
  app.use('/api/followships', followships)
}
