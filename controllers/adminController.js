const { User, Tweet } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const moment = require('moment')

const adminController = {
  signIn: async (req, res, next) => {
    try {
      const { email, password } = req.body
      // 檢查必填資料
      if (!email || !password) {
        return res.json({ status: 'error', message: 'Email跟密碼皆為必填！' })
      }
      // 檢查 user 是否存在和密碼是否正確
      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.json({ status: 'error', message: '找不到此Email。' })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.json({ status: 'error', message: '帳號或密碼不正確！' })
      }
      // 檢查是否為非管理者
      if (user.role === 'normal') {
        return res.json({ status: 'error', message: '非管理者無法登入後台！' })
      }
      // 簽發 token
      const payload = { id: user.id }
      const token = jwt.sign(payload, 'SimpleTwitterSecret')
      return res.json({
        status: 'success',
        message: '登入成功！',
        token: token,
        user: {
          // 這包user回傳資料可依前端需求增減
          id: user.id,
          account: user.account,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const result = await Tweet.findAll({
        raw: true,
        nest: true,
        attributes: ['id', 'description', 'createdAt'],
        order: [
          ['createdAt', 'DESC']
        ],
        include: [{
          model: User,
          attributes: ['id', 'name', 'account', 'avatar'],
        }]
      })
      // 將取得資料做整理
      const tweets = result.map(tweet => ({
        ...tweet,
        description: tweet.description.substring(0, 50),
        createdAt: moment(tweet.createdAt).format('YYYY-MM-DD kk:mm:ss')
      }))
      return res.json({ status: 'success', tweets })
    } catch (err) {
      next(err)
      return res.json({ status: 'error', message: err.toString() })
    }
  }
}

module.exports = adminController