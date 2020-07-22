const tweetController = require('../controllers/tweetController.js')

module.exports = (app) => {
  app.get('/api/tweets', tweetController.getTweets)
  app.get('/api/tweets/:id', tweetController.getTweet)
  app.post('/api/tweets', tweetController.postTweet)
}