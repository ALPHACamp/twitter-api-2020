const bcrypt = require('bcryptjs')
const db = require('../models/index')
const User = db.User

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let userController = {
  // 登入
  signIn: (req, res) => {
    // 取得資料
    const { account, name, email, password, checkPassword } = req.body
    // 檢查必要資料
    if (!email || !password) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }
    // 查詢user
    User.findOne({ where: { email } }).then(user => {
      if (!user) return res.status(401).json({ status: 'error', message: '使用者未註冊' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: '密碼錯誤' })
      }
      // 簽發 token
      var payload = { id: user.id }
      var token = jwt.sign(payload, 'alphacamp')
      return res.json({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin
        }
      })
    })
      .catch(err => {
        return res.status(500).json({ status: 'error', message: '伺服器錯誤請稍後' })
      })
  },
  // 註冊
  signUp: async (req, res) => {
    // 取回資料
    const { account, name, email, password, checkPassword } = req.body
    // 回傳user註冊資料
    const userData = { account, name, email, password, checkPassword }
    // 判斷所有項目都到齊
    if (!account || !name || !email || !password || !checkPassword) {
      return res.status(400).json({ status: 'error', message: '所有欄位都是必填', userData })
    }
    // 判斷密碼不相符
    if (password !== checkPassword) {
      return res.status(400).json({ status: 'error', message: '密碼與確認密碼不相符', userData })
    }
    try {
      // 判斷 Account 與 Email 是否重複註冊
      const errors = []
      const [duplicateAccount, duplicateEmail] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])
      if (duplicateAccount) {
        errors.push('帳號已重複')
      }
      if (duplicateEmail) {
        errors.push('信箱已重複')
      }
      if (errors.length) {
        return res.status(400).json({ status: 'error', message: errors, userData })
      } else {
        // 建立使用者
        const passwordBcrypt = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        User.create({
          account, name, email, password: passwordBcrypt
        }).then(user => {
          return res.status(200).json({ status: 'success', message: '註冊成功' })
        }).catch(err => res.status(500).json({ status: 'error', message: '註冊流程-伺服器錯誤請稍後'}))
      }
    } catch (err) {
      res.status(500).json({ status: 'error', message: '註冊流程-伺服器錯誤請稍後' })
    }

  }
}

module.exports = userController
