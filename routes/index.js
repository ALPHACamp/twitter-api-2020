const tweetController = require('../controllers/tweetController.js')
const userController = require('../controllers/userController')

module.exports = (app) => {
  app.get('/api/tweets', tweetController.getTweets)
  app.get('/api/tweets/:id', tweetController.getTweet)
  app.post('/api/tweets', tweetController.postTweet)

  app.post('/api/register', userController.register)
}