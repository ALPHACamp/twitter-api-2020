const { Tweet } = require('../../models')

const tweetContorller = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      raw: true
    })
      .then(tweets => {
        res.json(tweets)
      })
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    const TweetId = req.params.tweet_id

    return Tweet.findByPk(TweetId)
      .then(tweet => {
        res.json(tweet)
      })
      .catch(err => next(err))
  }
}

module.exports = tweetContorller
