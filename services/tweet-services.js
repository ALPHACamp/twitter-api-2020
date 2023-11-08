const { Tweet } = require('../models')
const helpers = require('../_helpers')

const tweetServices = {
  getTweets: (req, cb) => {
    Tweet.findAll({
      raw: true,
      nest: true,
    })
      .then(tweets => cb(null, tweets))
      .catch(err => cb(err))
  },
  getTweet: (req, cb) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => cb(null, tweet))
      .catch(err => cb(err))
  },
  postTweet: (req, cb) => {
    const UserId = helpers.getUser(req).id
    const { description } = req.body
    if (!UserId) res.status(500).json({
      status: 'error',
      data: {
        'Error Message': 'userId is required'
      }
    })
    const { file } = req
    Tweet.create({ UserId, description })
      .then(newTweet => {

        cb(null, { tweet: newTweet })
      })
      .catch(err => cb(err))
  }
}
module.exports = tweetServices