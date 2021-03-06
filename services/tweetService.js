const db = require('../models')
const { Tweet, Like, Reply, User } = db
const helper = require('../_helpers')

const tweetService = {
  postTweet: async (req, res, callback) => {
    try {
      if (!req.body.description) {
        return callback({ status: 'error', message: "content didn't exist" })
      }
      const user = helper.getUser(req)
      await Tweet.create({ UserId: user.id, description: req.body.description })
      callback({ status: 'success', message: 'tweet was successfully created' })
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'codeStatus 500' })
    }
  },
  getTweets: async (req, res, callback) => {
    try {
      const tweets = await Tweet.findAll({
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [
          { model: Like },
          { model: Reply },
          { model: User }
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
        {
          include: [
            { model: Like },
            { model: Reply, include: User },
            { model: User }
          ]
        })
      callback(tweet)
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'codeStatus 500' })
    }
  }
}

module.exports = tweetService