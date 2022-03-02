const jwt = require('jsonwebtoken')
const { User, Tweet } = require('../models')
const helpers = require('../_helpers')
const adminController = {
  signIn: async (req, res, next) => {
    try {
      const user = helpers.getUser(req).toJSON()
      delete user.password
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        message: 'login success!',
        data: {
          token,
          user
        }
      })
    } catch (err) { next(err) }
  },
  getUsers: async (req, res, next) => {
    try {
      const user = await User.findAll({
        raw: true,
        order: [['tweetCount', 'desc']]
      })
      if (!user) return res.status(400).json({
        status: 'error',
        message: 'Users not found!'
      })
      res.json({
        status: 'success',
        message: 'Admin getUser success!',
        data: user
      })
    } catch (err) { next(err) }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        order: [['createdAt', 'desc']],
        include: User
      })
      if (tweets.length === 0) return res.status(400).json({
        status: 'error',
        message: 'Tweets not found'
      })
      const data = tweets.map(tweet => {
        tweet.shortd_escription = tweet.description.substring(0, 50)
        tweet.username = tweet.User.name
        tweet.account = tweet.User.account
        tweet.avatar = tweet.User.avatar
        delete tweet.User
        return { ...tweet }
      })
      res.json({
        status: 'success',
        message: 'Admin getTweets success',
        tweets: data
      })
    } catch (err) { next(err) }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)

      if (!tweet) return res.status(400).json({
        status: 'error',
        message: 'tweet does not exist'
      })

      tweet.destroy()

      res.json({
        status: 'success',
        message: 'delete tweet success'
      })
    } catch (err) { next(err) }
  }
}

module.exports = adminController