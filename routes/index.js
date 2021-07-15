const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const tweetController = require('../controllers/tweetController')
const replyController = require('../controllers/replyController')
const passport = require('../config/passport')
const helpers = require('../_helpers')
const multer = require('multer')

const upload = multer({
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error('只接受 jpg、jpeg、png 檔案'))
    }
    cb(null, true)
  },
  dest: 'temp/'
})
const cpUpload = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
])

function authenticated(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' })
    }
    req.user = user // JWT 沒有使用 session，所以需要手動設置
    return next()
  })(req, res, next)
}
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

const authenticatedNotAdmin = (req, res, next) => {
  if (helpers.getUser(req).role === 'admin') {
    return res.json({ status: 'error', message: '管理者請從後台登入' })
  } else {
    return next()
  }
}

module.exports = app => {
  app.get('/', (req, res) => res.send('Hello World!'))
  app.post('/api/users', userController.signUp)
  app.post('/api/users/signin', userController.signIn)
  app.post('/api/admin/signin', adminController.signIn)
  // admin
  app.get('/api/admin/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
  app.get('/api/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
  app.delete('/api/admin/tweets/:tweetId', authenticated, authenticatedAdmin, adminController.deleteTweets)

  // users
  app.get('/api/users', authenticated, authenticatedNotAdmin, userController.getTopUsers)
  app.get('/api/users/currentUser', authenticated, authenticatedNotAdmin, userController.getCurrentUser)
  app.get('/api/users/:userId', authenticated, authenticatedNotAdmin, userController.getUser)
  app.get('/api/users/:userId/tweets', authenticated, authenticatedNotAdmin, userController.getUserTweets)
  app.get('/api/users/:userId/replied_tweets', authenticated, authenticatedNotAdmin, userController.getAllReplies)
  app.put('/api/users/:userId', authenticated, authenticatedNotAdmin, cpUpload, userController.putUser)
  app.get('/api/users/:userId/likes', authenticated, authenticatedNotAdmin, userController.getLikes)
  app.get('/api/users/:userId/followers', authenticated, authenticatedNotAdmin, userController.getFollowers)
  app.get('/api/users/:userId/followings', authenticated, authenticatedNotAdmin, userController.getFollowings)
  app.post('/api/followships', authenticated, authenticatedNotAdmin, userController.addFollowing)
  app.delete('/api/followships/:followingId', authenticated, authenticatedNotAdmin, userController.removeFollowing)

  // tweets
  app.get('/api/tweets', authenticated, authenticatedNotAdmin, tweetController.getTweets)
  app.get('/api/tweets/:tweetId', authenticated, authenticatedNotAdmin, tweetController.getTweet)
  app.post('/api/tweets', authenticated, authenticatedNotAdmin, tweetController.postTweets)
  app.put('/api/tweets/:tweetId', authenticated, authenticatedNotAdmin, tweetController.putTweet)
  app.post('/api/tweets/:tweetId/replies', authenticated, authenticatedNotAdmin, replyController.postReply)
  app.get('/api/tweets/:tweetId/replies', authenticated, authenticatedNotAdmin, replyController.getReply)

  app.post('/api/tweets/:tweetId/like', authenticated, tweetController.likeTweet)
  app.post('/api/tweets/:tweetId/unlike', authenticated, tweetController.unlikeTweet)

  // // replies
  // app.post('/replies/:replyId/like')
  // app.delete('/replies/:replyId/like')
}
