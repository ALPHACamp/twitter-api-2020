const helpers = require('../_helpers')
const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const tweetController = {
  getTweets: async (req, res) => {
    try {
      let offset = 0
      const limit = Number(req.query.limit) || 20
      if (req.query.page) {
        offset = (Number(req.query.page - 1)) * limit
      }
      const tweet = await Tweet.findAll({
        include: User,
        order: [
          ['createdAt', 'DESC']
        ],
        offset,
        limit
      })
      const likeList = await Like.findAll({ where: { UserId: helpers.getUser(req).id } })
      const tweetdata = tweet.map(tweet => ({
        ...tweet.dataValues,
        name: tweet.User.name,
        avatar: tweet.User.avatar,
        account: tweet.User.account,
        isLiked: likeList.map(d => d.TweetId).includes(tweet.id)
      }))
      return res.json(tweetdata)
    } catch (err) {
      const data = { status: 'error', message: err }
      return res.json(data)
    }
  },
  getTweetsAll: async (req, res) => {
    try {
      const tweet = await Tweet.findAll({
        include: User,
        order: [
          ['createdAt', 'DESC']
        ]
      })
      const likeList = await Like.findAll({ where: { UserId: helpers.getUser(req).id } })
      const tweetdata = tweet.map(tweet => ({
        ...tweet.dataValues,
        name: tweet.User.name,
        avatar: tweet.User.avatar,
        account: tweet.User.account,
        isLiked: likeList.map(d => d.TweetId).includes(tweet.id)
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
      const likeList = await Like.findAll({ where: { UserId: helpers.getUser(req).id } })
      tweet.dataValues.isLiked = likeList.map(d => d.TweetId).includes(tweet.id)
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
        const data = { status: 'empty_error', message: "content didn't exist" }
        return res.json(data)
      }
      if (description.length > 140) {
        const data = { status: 'length_error', message: 'the word count of a tweet is limited to 140' }
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
