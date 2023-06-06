const { User, Tweet } = require('../models')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const { newErrorGenerate } = require('../helpers/newError-helper')

const adminController = {
  // 後台登入
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      if (userData.role !== '管理員') newErrorGenerate('帳號不存在！', 404)
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  // 取得所有推文及該推文使用者資料
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        include: [User]
      })
      return res.json({ status: 'success', data: { tweets } })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
