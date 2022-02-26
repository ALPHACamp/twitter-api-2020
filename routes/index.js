const userController = require('../controllers/user-controller')
const user = require('./user')
const admin = require('./admin')
const tweet = require('./tweet')
const followship = require('./followship')
const { authenticated, authenticatedUser } = require('../middleware/api-auth')
const { apiErrorHandler } = require('../middleware/error-handler')

module.exports = (app) => {
  app.post('/api/signin', userController.signIn) //他沒有前綴所以留在這
  app.use('/api/users', user)
  app.use('/api/admin', admin)
  app.use('/api/tweets', authenticated, authenticatedUser, tweet)
  app.use('/api/followships', authenticated, authenticatedUser, followship)
  app.use('/', apiErrorHandler) //放最後一關檢查
}
