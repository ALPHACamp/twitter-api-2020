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
        if (!tweet) throw new Error('Tweet not exist!')
        res.status(200).json(tweet)
      })
      .catch(err => next(err))
  },
  postTweet: (req, res, next) => {
    const { description } = req.body
    const UserId = helpers.getUser(req).id
    if (!description) throw new Error('description is required!')
    return Tweet.create({
      UserId,
      description
    })
      .then(addTweet => {
        res.status(200).json(addTweet)
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController