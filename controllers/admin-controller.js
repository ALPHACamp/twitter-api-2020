const jwt = require('jsonwebtoken')
const { User, Tweet } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const adminController = {
  signIn: async (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        message: 'login success!',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) { next(err) }
  },
  getUsers: async (req, res, next) => {
    try {
      const user = await User.findAll({ raw: true })
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
        tweet.username = tweet.User.name
        tweet.account = tweet.User.account
        delete tweet.User
        return { ...tweet }
      })
      res.json({
        status: 'success',
        message: 'Admin getTweets success',
        data
      })
    } catch (err) { next(err) }
  }
}

module.exports = adminController