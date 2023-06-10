const { Tweet, User, Reply } = require('../models')

const tweetController = {
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
    const tweetId = req.params.tweetId
    return Tweet.findByPk(tweetId)
      .then(tweet => {
        console.log(tweet)
        res.json( tweet )
      })
      .catch(err => next(err))
  },
  getReplies: (req, res, next) => {
    const tweetId = req.params.tweetId
    return Reply.findAll({
      where: {tweetId}
    })
      .then(replies => {
        console.log(replies)
        res.json(replies)
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController
