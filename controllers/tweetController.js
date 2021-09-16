const helpers = require('../_helpers')
const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply

const tweetController = {
  getTweets: async (req, res) => {
    try {
      let offset = 0
      const limit = req.query.limit || 20
      if (req.query.page) {
        offset = (req.query.page - 1) * limit
      }
      const tweet = await Tweet.findAll({
        include: User,
        order: [
          ['createdAt', 'DESC']
        ],
        offset,
        limit
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
      const description = req.body.description
      if (description.trim() === '') {
        const data = { status: 'error', message: "content didn't exist" }
        return res.json(data)
      }
      if (description.length > 140) {
        const data = { status: 'error', message: 'the word count of a tweet is limited to 140' }
        return res.json(data)
      }
      await Tweet.create({
        UserId: helpers.getUser(req).id,
        description
      })
      const user = await User.findByPk(helpers.getUser(req).id)
      await user.increment(['tweetCount'], { by: 1 })
      const data = { status: 'success', message: 'a new tweet was successfully posted' }
      return res.json(data)
    } catch (err) {
      const data = { status: 'error', message: err }
      return res.json(data)
    }
  }
}

module.exports = tweetController
