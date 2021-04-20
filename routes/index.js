const { authenticated, authenticatedAdmin } = require('../middleware/authenticate')
const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const users = require('./modules/users')
const admin = require('./modules/admin')
module.exports = (app) => {
  app.post('/api/users/login', userController.login)
  app.use('/api/users', authenticated, users)

  app.post('/api/admin/login', adminController.login)
  app.use('/api/admin', authenticated, authenticatedAdmin, admin)
}
