const { Tweet } = require('../models')
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);
const helpers = require('../_helpers')

const tweetServices = {
  getTweets: (req, cb) => {
    Tweet.findAll({
      raw: true,
      nest: true,
    })
      .then(tweets => {
        for (let i = 0; i < tweets.length; i++) {
          const createdAtDate = dayjs(tweets[i].createdAt);
          const updatedAtDate = dayjs(tweets[i].updatedAt);
          tweets[i].createdAt = createdAtDate.fromNow()
          tweets[i].updatedAt = updatedAtDate.fromNow()
        }
        cb(null, tweets);
      })
      .catch(err => cb(err))
  },
  getTweet: (req, cb) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) {
          throw new Error("Tweet didn't exist!");
        }
        tweet = tweet.toJSON();
        tweet.createdAt = dayjs(tweet.createdAt).fromNow();
        tweet.updatedAt = dayjs(tweet.updatedAt).fromNow();
        return cb(null, tweet);
      })
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