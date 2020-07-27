const passport = require('../config/passport')
const helpers = require('../_helpers')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])

const tweetController = require('../controllers/tweetController.js')
const replyController = require('../controllers/replyController.js')
const userController = require('../controllers/userController.js')
const adminController = require('../controllers/adminController.js')

// middleware
const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'admin') { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

//for test
// const authenticated = (req, res, next) => {
//   if (helpers.ensureAuthenticated(req)) {
//     return next()
//   } else {
//     return res.json({ status: 'error', message: 'permission denied' })
//   }
// }

// const authenticatedAdmin = (req, res, next) => {
//   if (helpers.ensureAuthenticated(req)) {
//     if (helpers.getUser(req).role === 'admin') return next()
//     return res.json({ status: 'error', message: 'permission denied' })
//   } else {
//     return res.json({ status: 'error', message: 'permission denied' })
//   }
// }

module.exports = (app) => {
  app.get('/', authenticated, (req, res) => res.send('Hello World!')) //postman test
  app.get('/admin', authenticated, authenticatedAdmin, (req, res) => res.send('Hello Admin!')) //postman test
  app.get('/api/tweets', authenticated, tweetController.getTweets)
  app.get('/api/tweets/:id', authenticated, tweetController.getTweet)
  app.post('/api/tweets', authenticated, tweetController.postTweet)
  app.get('/api/tweets/:tweet_id/replies', authenticated, replyController.getReplies)
  app.post('/api/tweets/:tweet_id/replies', authenticated, replyController.postReply)
  app.get('/api/users/:id', authenticated, userController.getUser)
  app.get('/api/users/:id/tweets', authenticated, userController.getUserTweets)
  app.get('/api/users/:id/replied_tweets', authenticated, userController.getUserReply)
  app.get('/api/users/:id/likes', authenticated, userController.getUserLike)
  app.get('/api/users/:id/followers', authenticated, userController.getFollowers)
  app.get('/api/users/:id/followings', authenticated, userController.getFollowings)
  app.post('/api/followships', authenticated, userController.addFollowing)
  app.delete('/api/followships/:followingId', authenticated, userController.removeFollowing)
  app.post('/api/tweets/:id/like', authenticated, userController.addLike)
  app.post('/api/tweets/:id/unlike', authenticated, userController.removeLike)
  app.get('/api/following/top', authenticated, userController.getTopUsers)

  app.post('/api/users', userController.register)
  app.post('/api/login', userController.login)

  app.put('/api/users/:id', authenticated, cpUpload, userController.putUser)

  app.get('/api/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
  app.delete('/api/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)
}