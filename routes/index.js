const tweetController = require('../controllers/tweetController')

module.exports = app => {
  app.get('/', (req, res) => res.render('tweets'))
  app.get('/tweets', tweetController.getTweets)
}