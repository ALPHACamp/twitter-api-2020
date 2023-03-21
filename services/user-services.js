const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const assert = require('assert')

const helpers = require('../_helpers')
const { User } = require('../models')

const userService = {
  signUp: (req, cb) => {
    const { account, name, email, password, checkPassword } = req.body
    // 檢查email格式用的 function
    const checkEmail = data => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailPattern.test(data)
    }
    // 檢查name的長度
    const checkNameLength = name.length
    // 使用assert來做判斷錯誤地拋出與否
    assert(account && name && email && password && checkPassword, '所有欄位皆須填寫')
    assert(checkNameLength <= 50, 'name 字數超出上限50字')
    assert(checkEmail(email), 'Email格式錯誤')
    assert(password === checkPassword, '密碼與確認密碼不一致')
    Promise.all([
      User.findOne({ where: { account: req.body.account } }),
      User.findOne({ where: { email: req.body.email } })
    ])
      .then(([checkAccount, checkEmail]) => {
        assert(!checkAccount, 'account 已重複註冊！')
        assert(!checkEmail, 'email 已重複註冊！')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash,
        role: 'user',
        avatar: 'https://i.imgur.com/ZyXrPxB.png',
        cover: 'https://imgur.com/a/lGG5iGQ'
      }))
      .then(signedUser => {
        const userData = signedUser.toJSON()
        delete userData.password
        cb(null, { user: userData })
      })
      .catch(err => cb(err))
  },
  signIn: (req, cb) => {
    try {
      // 按照原始檔給的有提到要引入 helpers 並用 helpers.getUser(req) 來做 req.user的替代
      const userData = helpers.getUser(req).toJSON()
      // if (userData?.role === 'admin') return res.status(403).json({ status: 'error', message: '帳號不存在！' })
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      cb(null, { token, user: userData })
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = userService
