const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const tweetController = require('../controllers/tweetController')
const replyController = require('../controllers/replyController')
const chatController = require('../controllers/chatController')
const { authenticated, authenticatedAdmin, authenticatedNotAdmin } = require('../middleware/auth')
const { cpUpload } = require('../middleware/functions')

module.exports = (app) => {
  //sign in & sign up
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

  // chats
  app.get('/api/chats/public-messages', authenticated, chatController.getHistoryMessage)
}
