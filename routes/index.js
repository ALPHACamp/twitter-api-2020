const user = require('./user')
const userController = require('../controllers/userController')

module.exports = (app) => {
  app.use('/api/users', user)
  app.post('/api/login', userController.login)
}