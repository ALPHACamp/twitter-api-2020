const user = require('./user')
const tweet = require('./tweet')
const { authenticated } = require('../middlewares/auth')
const userController = require('../controllers/userController')

module.exports = (app) => {
  app.use('/api/users', user)
  app.post('/api/login', userController.login)
  app.use('/api/tweets', authenticated, tweet)
}