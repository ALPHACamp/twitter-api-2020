const db = require('../models')
const { Tweet, Like, Reply } = db

const tweetService = {
  postTweet: async (req, res, callback) => {
    try {
      if (!req.body.description) {
        return callback({ status: 'error', message: "content didn't exist" })
      }
      await Tweet.create({ ...req.body })
      callback({ status: 'success', message: 'tweet was successfully created' })
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'codeStatus 500' })
    }
  },
  getTweets: async (req, res, callback) => {
    try {
      const tweets = await Tweet.findAll({
        raw: true, nest: true,
        order: [['createdAt', 'DESC']],
        include: [
          { model: Like },
          { model: Reply }
        ]
      })
      callback(tweets)
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'codeStatus 500' })
    }
  },
  getTweet: async (req, res, callback) => {
    try {
      const tweet = await Tweet.findByPk(
        req.params.id,
        { include: [{ model: Like }, { model: Reply }] }
      )
      callback(tweet)
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'codeStatus 500' })
    }
  }
}

module.exports = tweetService