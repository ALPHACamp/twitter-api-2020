const tweetController = require('../controllers/tweetController.js')
const replyController = require('../controllers/replyController.js')
const userController = require('../controllers/userController.js')

module.exports = (app) => {
  app.get('/api/tweets', tweetController.getTweets)
  app.get('/api/tweets/:id', tweetController.getTweet)
  app.post('/api/tweets', tweetController.postTweet)

  app.post('/api/reply', replyController.postReply)

  app.get('/api/users/:id', userController.getUser)
}