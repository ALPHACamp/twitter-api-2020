const { authenticated, authenticatedAdmin } = require('../middleware/authenticate')
const userController = require('../controllers/userController')
const users = require('./modules/users')
module.exports = (app) => {
  app.post('/api/users/login', userController.login)
  app.use('/api/users', authenticated, users)
}
