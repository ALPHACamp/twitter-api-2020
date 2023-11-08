const { Tweet } = require('../models')
const tweetServices = {
  getTweets: (req, cb) => {
    Tweet.findAll({
      raw: true,
      nest: true,
    })
      .then(tweets => cb(null, { tweets }))
      .catch(err => cb(err))
  },
  getTweet: (req, cb) => {
    return Tweet.findByPk(req.params.id)
    .then(tweet => cb(null, { tweet }))
    .catch(err => cb(err))
  },
  postTweet: (req, cb) => {
    const { UserId, description} = req.body
    if (!UserId) throw new Error('UserId is required!')
    const { file } = req
      Tweet.create({ UserId, description })
        .then(newTweet => cb(null, { tweet: newTweet }))
        .catch(err => cb(err))
  }
}
module.exports = tweetServices