const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const followshipController = require('../controllers/followshipController')
const tweetController = require('../controllers/tweetController')

const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })

const multer = require('multer')
let upload = multer()

const db = require('../models')
const User = db.User

module.exports = (app) => {
  app.get('/api/get_current_user', authenticated, userController.getCurrentUser)

  app.post('/api/users/signin', userController.signIn)
  app.post('/api/users', userController.signUp)
  app.put('/api/users/userInfo', authenticated, upload.array('files', 2), userController.putUserInfo)
  app.put('/api/users/:id', authenticated, userController.putUser)
  app.get('/api/users/:id/tweets', authenticated, userController.getUserTweets)
  app.get('/api/users/:id/replied_tweets', authenticated, userController.getUserRepliedTweets)
  app.get('/api/users/:id/likes', authenticated, userController.getUserLikes)
  app.get('/api/users/:id/followings', authenticated, userController.getUserFollowings)
  app.get('/api/users/:id/followers', authenticated, userController.getUserFollowers)
  app.get('/api/users/:id', authenticated, userController.getUser)

  app.get('/api/followships/recommended', authenticated, followshipController.getRecommendedFollowings)
  app.post('/api/followships', authenticated, followshipController.postFollowship)
  app.delete('/api/followships/:id', authenticated, followshipController.deleteFollowship)

  app.get('/api/tweets', authenticated, authenticated, tweetController.getTweets)
  app.post('/api/tweets', authenticated, tweetController.postTweet)
  app.post('/api/tweets/:id/like', authenticated, tweetController.likeTweet)
  app.post('/api/tweets/:id/unlike', authenticated, tweetController.unlikeTweet)
  app.get('/api/tweets/:id/replies', authenticated, tweetController.getTweetReplies)
  app.post('/api/tweets/:id/replies', authenticated, tweetController.postTweetReply)
  app.get('/api/tweets/:id', authenticated, tweetController.getTweet)

  app.post('/api/admin/users/signin', adminController.signIn)
  app.get('/api/admin/users', adminController.getUsers)
  app.get('/api/admin/tweets', adminController.getTweet)
  app.delete('/api/admin/tweets/:id', adminController.deleteTweet)
}