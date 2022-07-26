const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const followshipController = require('../controllers/followshipController')
const tweetController = require('../controllers/tweetController')

module.exports = (app) => {
  app.post('/api/users', userController.signUp)
  app.put('/api/users/:id', userController.putUser)
  app.get('/api/users/:id/tweets', userController.getUserTweets)
  app.get('/api/users/:id/replied_tweets', userController.getUserRepliedTweets)
  app.get('/api/users/:id/likes', userController.getUserLikes)
  app.get('/api/users/:id/followings', userController.getUserFollowings)
  app.get('/api/users/:id/followers', userController.getUserFollowers)
  app.get('/api/users/:id', userController.getUser)

  app.post('/api/followships', followshipController.postFollowship)
  app.delete('/api/followships/:id', followshipController.deleteFollowship)

  app.get('/api/tweets')
  app.post('/api/tweets')
  app.post('/api/tweets/:id/like', tweetController.likeTweet)
  app.post('/api/tweets/:id/unlike', tweetController.unlikeTweet)
  app.get('/api/tweets/:id/replies')
  app.post('/api/tweets/:id/replies')
  app.get('/api/tweets/:id')

  app.get('/api/admin/users', adminController.getUsers)
  app.delete('/api/admin/tweets/:id', adminController.deleteTweet)
}