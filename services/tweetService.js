const db = require('../models')
const { Tweet, Like, Reply } = db

const tweetService = {
  postTweet: (req, res, callback) => {
    if (!req.body.description) {
      callback({ status: 'error', message: "content didn't exist" })
    }
    Tweet.create({ ...req.body })
      .then(tweet => {
        callback({ status: 'success', message: 'tweet was successfully created' })
      })
  },
  getTweets: (req, res, callback) => {
    Tweet.findAll({
      raw: true, nest: true,
      order: [['createdAt', 'DESC']],
      include: [
        { model: Like },
        { model: Reply }
      ]
    })
      .then(tweets => {
        callback(tweets)
      })
  },
  getTweet: (req, res, callback) => {
    Tweet.findByPk(req.params.id,
      {
        include: [
          { model: Like },
          { model: Reply }
        ]
      }).then(tweet => {
        callback(tweet)
      })
  }
}

module.exports = tweetService