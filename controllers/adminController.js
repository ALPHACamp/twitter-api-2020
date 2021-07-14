const { User, Tweet, Like, Reply } = require('../models')
const helpers = require('../_helpers')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Sequelize = require('sequelize')

const adminController = {
  signin: async (req, res, next) => {
    try {
      const { account, password } = req.body
      if (!account || !password) return res.json({ status: 'error', message: '請填寫所有欄位' })
      const user = await User.findOne({ where: { account, role: 'admin' } })
      if (!user) return res.status(401).json({ status: 'error', message: '查無此管理員' })
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) return res.status(401).json({ status: 'error', message: '密碼輸入錯誤' })

      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'ok',
        token,
        user: {
          id: user.id, account: user.account, name: user.name, email: user.email, role: user.role
        }
      })
    }
    catch (err) {
      next(err)
    }
  },

  getAllUser: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'admin') return res.json({ status: 'error', message: '此功能為管理員專用' })
      const users = await User.findAll({
        attributes: [
          'id',
          'name',
          'account',
          'avatar',
          'cover',
          [Sequelize.literal('(SELECT COUNT (*) FROM Likes WHERE TweetId IN (SELECT id FROM Tweets WHERE UserId = User.id))'), 'totalLikes'],
          [Sequelize.literal('(SELECT COUNT (*) FROM Tweets WHERE UserId = User.id)'), 'totalTweets'],
          [Sequelize.literal('(SELECT COUNT (*) FROM Followships WHERE followingId = User.id)'), 'totalFollowers'],
          [Sequelize.literal('(SELECT COUNT (*) FROM Followships WHERE followerId = User.id)'), 'totalFollowings']
        ],
      })
      return res.json(users)
    }
    catch (err) {
      next(err)
    }
  },

  getAllTweet: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'admin') return res.json({ status: 'error', message: '此功能為管理員專用' })
      let tweets = await Tweet.findAll({
        attributes: ['id', 'description', 'createdAt'],
        include: [
          { model: User, attributes: ['id', 'avatar', 'name', 'account'] },
        ],
      })
      return res.json(tweets)
    }
    catch (err) {
      next(err)
    }
  },

  deleteTweet: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'admin') return res.json({ status: 'error', message: '此功能為管理員專用' })
      const tweet = await Tweet.findByPk(req.params.id) || false
      if (tweet) {
        await tweet.destroy()
        return res.json({ status: 'success', message: "推文刪除成功" })
      }
    }
    catch (err) {
      next(err)
    }
  }
}

module.exports = adminController