const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const passport = require('../config/passport')

const authenticated = passport.authenticate('jwt', { session: false })
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).role === 'admin') {
      return next()
    }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

module.exports = (app) => {
  app.get('/', (req, res) => res.send('Hello World!'))
  app.post('/signup', userController.signUp)
  app.post('/signin', userController.signIn)

  app.post('/signin/admin', adminController.signIn)
  // // admin
  // app.get('/admin/tweets')
  // app.get('/admin/users')
  // // users
  // app.get('/users/:userId')
  // app.get('/users/:userId/replies')
  // app.put('/users/:userId/edit')
  // app.get('/users/:userId/likes')
  // app.get('/users/:userId/followers')
  // app.get('/users/:userId/followings')
  // app.post('/users/:userId/follow')
  // app.delete('/users/:userId/follow')
  // // tweets
  // app.get('/tweets')
  // app.get('/tweets/:tweetId')
  // app.post('/tweets')
  // app.post('/tweets/:tweetId/replies')
  // app.put('/tweets/:tweetId')
  // app.delete('/tweets/:tweetId')
  // app.post('/tweets/:tweetId/like')
  // app.delete('/tweets/:tweetId/like')
  // // replies
  // app.post('/replies/:replyId/like')
  // app.delete('/replies/:replyId/like')
}
