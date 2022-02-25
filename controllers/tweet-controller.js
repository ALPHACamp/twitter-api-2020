const { Tweet, Reply } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      order: [[ 'createdAt', 'DESC' ]]
    })
      .then(tweets => {
        res.status(200).json(tweets)
      })
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    const getTweetId = Number(req.params.id)
    return Tweet.findByPk(getTweetId, {
      include: { model: Reply }
    })
      .then(tweet => {
        res.status(200).json(tweet)
      })
      .catch(err => next(err))
  },
  // postTweet: (req, res, next) => {

  // }
}

module.exports = tweetController