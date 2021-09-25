const users = require('./apis/users')
const admin = require('./apis/admin')
const tweets = require('./apis/tweets')
const followships = require('./apis/followships')
const userController = require('../controllers/userController')


module.exports = app => {
  app.use('/api/users', users)
  app.use('/api/admin', admin)
  app.use('/api/tweets', tweets)
  app.use('/api/followships', followships)

  app.get('/', (req, res) => {
    res.render('index')
  })
  app.get('/login', (req, res) => {
    res.render('login')
  })
  app.post('/', userController.Login)
}