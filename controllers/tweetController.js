const helpers = require('../_helpers')
const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply

const tweetController = {
  getTweets: async (req, res) => {
    try {
      const tweet = await Tweet.findAll({
        include: User,
        order: [
          ['createdAt', 'DESC']
        ]
      })
      const tweetdata = tweet.map(tweet => ({
        ...tweet.dataValues,
        name: tweet.User.name,
        avatar: tweet.User.avatar,
        account: tweet.User.account
      }))
      return res.json(tweetdata)
    } catch (err) {
      const data = { status: 'error', message: err }
      return res.json(data)
    }
  },
  getTweet: async (req, res) => {
    try {
      const tweet = await Tweet.findByPk(req.params.tweet_id, {
        include: [
          User,
          { model: Reply, include: [User] }
        ]
      })
      return res.json(tweet)
    } catch (err) {
      const data = { status: 'error', message: err }
      return res.json(data)
    }
  },
  postTweet: async (req, res) => {
    try {
      if (!req.body.description) {
        const data = { status: 'error', message: "content didn't exist" }
        return res.json(data)
      }
      await Tweet.create({
        UserId: helpers.getUser(req).id,
        description: req.body.description
      })
      const data = { status: 'success', message: 'a new tweet was successfully posted' }
      return res.json(data)
    } catch (err) {
      const data = { status: 'error', message: err }
      return res.json(data)
    }
  }
}

module.exports = tweetController
