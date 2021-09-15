const user = require('./user')
const tweet = require('./tweet')
const followship = require('./followship')
const { authenticated } = require('../middlewares/auth')
const userController = require('../controllers/userController')
const routes = require('./routes')
const apis = require('./apis')

module.exports = (app) => {
  app.use('/api/users', user)
  app.post('/api/login', userController.login)
  app.use('/api/tweets', authenticated, tweet)
  app.use('/api/followships', authenticated, followship)
  app.use('/', routes)
  app.use('/api', apis)
}