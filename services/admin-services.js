const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sequelize = require('sequelize')
const { relativeTimeFormat } = require('../helpers/day-helpers')
const { User, Tweet, Reply } = require('../models')

const adminServices = {
  signIn: async (req, cb) => {
    try {
      const { account, password } = req.body
      if (!account || !password) {
        const err = new Error('請輸入帳號密碼')
        err.status = 403
        throw err
      }
      const user = await User.findOne({ where: { account } })
      if (!user) {
        const err = new Error('帳號密碼輸入錯誤')
        err.status = 403
        throw err
      }
      if (user.role === 'user') {
        const err = new Error('帳號不存在')
        err.status = 403
        throw err
      }
      if (!bcrypt.compareSync(password, user.password)) {
        const err = new Error('帳號密碼輸入錯誤')
        err.status = 403
        throw err
      }
      const userData = user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return cb(null, {
        token,
        user: userData
      })
    } catch (err) {
      cb(err)
    }
  },
  getUsers: async (req, cb) => {
    try {
      const users = await User.findAll({
        include: [
          Tweet,
          { model: Reply, include: Tweet },
          { model: Tweet, as: 'LikeTweets' },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
      const userData = users
        .map(user => ({
          ...user.toJSON(),
          Tweets: user.Tweets.length,
          Replies: user.Replies.length,
          LikeTweets: user.LikeTweets.length,
          Followers: user.Followers.length,
          Followings: user.Followings.length
        }))
        .sort((a, b) => b.Followers - a.Followers)
      cb(null, userData)
    } catch (err) {
      cb(err)
    }
  },
  getAdminTweets: async (req, cb) => {
    try {
      const tweets = await Tweet.findAll({
        attributes: [
          'UserId',
          'description',
          'createdAt',
          [
            sequelize.literal('(SELECT name FROM Users WHERE Users.id = userId)'),
            'userName'
          ],
          [
            sequelize.literal('(SELECT account FROM Users WHERE Users.id = userId)'),
            'userAccount'
          ]
        ],
        raw: true,
        nest: true
      })
      const tweetsData = await tweets.map(tweet => ({
        ...tweet,
        description: tweet.description.length > 80 ? tweet.description.substring(0, 80) + '...' : tweet.description,
        createdAt: relativeTimeFormat(tweet.createdAt)
      }))
      cb(null, tweetsData)
    } catch (err) {
      cb(err)
    }
  },
  deleteTweet: async (req, cb) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) {
        const err = new Error('推文不存在！')
        err.status = 404
        throw err
      }
      const deleteTweet = await tweet.destroy()
      cb(null, deleteTweet)
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = adminServices
