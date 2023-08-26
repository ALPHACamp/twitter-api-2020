
const jwt = require('jsonwebtoken')

const { User, Tweet, Reply, Like, Followship, sequelize } = require('../models')

const adminController = {
  // No.20 - 登入後台帳號 POST /api/admin/signin
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      // 角色若不是admin則不發給token
      if (userData.role !== 'admin') throw new Error('no such user(角色錯誤)', { cause: { accountErrMsg: '帳號不存在！', passwordErrMsg: '' } })

      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天

      return res.status(200).json({
        success: true,
        data: { token, user: userData }
      })
    } catch (err) {
      return next(err)
    }
  },
  // No.21 - 取得所有使用者清單 GET /api/admin/users
  getUsers: (req, res, next) => {
    try {
      // --資料提取--
      // const users = User.findAll({
      //   where: { role: 'user' },
      //   attributes: {
      //     exclude: ['password'],
      //     include: [[
      //       sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'),
      //       'tweetsNum'
      //     ]]
      //   },
      //   nest: true
      // })

      // --資料整理--




      return res.status(200).json({})
    } catch (err) {
      return next(err)
    }
  },
  // No.22 - 取得所有推文清單 GET /api/admin/tweets
  getTweets: (req, res, next) => {
    try {
      return res.status(200).json({})
    } catch (err) {
      return next(err)
    }
  },
  // No.23 - 刪除特定推文 DELETE /api/admin/tweets/:id
  deleteTweet: (req, res, next) => {
    try {
      return res.status(200).json({})
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = adminController
