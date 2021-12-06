const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sequelize = require('sequelize')

const { User, Tweet, Like, Followship, Reply } = require('../models')

const adminService = {
  signIn: (req, res, callback) => {
    if (!req.body.account || !req.body.password) {
      return callback({ status: 'error', message: '所有欄位皆為必填！' })
    }

    const account = req.body.account
    const password = req.body.password

    return User.findOne({ where: { account: account } }).then(async user => {
      if (!user) return callback({ status: 'error', message: '帳號不存在或密碼錯誤！' })
      if (!bcrypt.compareSync(password, user.password)) {
        return callback({ status: 'error', message: '帳號不存在或密碼錯誤！' })
      }
      const payload = { id: user.id }
      const token = await jwt.sign(payload, process.env.JWT_SECRET)
      return callback({
        status: 'success',
        message: '登入成功！',
        token: token,
        user: {
          id: user.id,
          account: user.account,
          name: user.name,
          email: user.email,
          role: user.role
        }
      })
    })
  },

  getUsers: (req, res, callback) => {
    return User.findAll({
      raw: true,
      nest: true,
      where: { role: 'user' },
      attributes: [
        'id',
        'name',
        'account',
        'avatar',
        'cover',
        [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'), 'tweetCount'],
        [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.UserId = User.id)'), 'likeCount'],
        [
          sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'),
          'followingCount'
        ],
        [
          sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)'),
          'followerCount'
        ]
      ]
    }).then(users => {
      users = users.sort((a, b) => b.tweetCount - a.tweetCount)
      return callback(users)
    })
  },

  getTweets: (req, res, callback) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      attributes: ['id', 'UserId', 'description', 'createdAt'],
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['name', 'account', 'avatar'] }]
    }).then(tweets => {
      tweets.forEach(tweet => tweet.description.substring(0, 50))
      return callback(tweets)
    })
  },

  deleteTweet: async (req, res, callback) => {
    await Tweet.destroy({ where: { id: req.params.id } })
    await Reply.destroy({ where: { TweetId: req.params.id } })
    await Like.destroy({ where: { TweetId: req.params.id } })

    return callback({ status: 'success', message: '成功刪除' })
  }
}

module.exports = adminService
