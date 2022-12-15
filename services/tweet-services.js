const { User, Tweet, Reply, Like } = require('./../models')
const tweetServices = {
  getTweets: (req, cb) => {
    return Tweet.findAll({
      include: [User]
    })
      .then(tweets => cb(null, tweets))
      .catch(err => cb(err))
  },
  getTweet: (req, cb) => {
    const { tweetId } = req.params
    return Tweet.findByPk(tweetId, {
      include: [User]
    })
      .then(tweet => cb(null, tweet))
      .catch(err => cb(err))
  }
}
module.exports = tweetServices
