const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

// JWT
const jwt = require('jsonwebtoken')

const userController = {
  signUp: (req, res) => {
    // 初始值去除空白字元
    const account = (req.body.account) ? req.body.account.trim() : req.body.account
    const name = (req.body.name) ? req.body.name.trim() : req.body.name
    const email = (req.body.email) ? req.body.email.trim() : req.body.email
    const password = (req.body.password) ? req.body.password.trim() : req.body.password

    if (!account || !name || !email || !password) {
      return res.json({ status: 'error', message: '所有欄位均不能空白' })
    }

    // 確認 email、account 有無重複
    User.findOne({ where: { email } })
      .then(user => {
        if (user) return res.json({ status: 'error', message: '此信箱已被使用' })
        return User.findOne({ where: { account } })
      })
      .then(user => {
        if (user) return res.json({ status: 'error', message: '此帳號已被使用' })
        return User.create({
          account,
          name,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
          role: 0
        })
      })
      .then(user => {
        return res.json({ status: 'success', message: '成功建立使用者資料' })
      })
      .catch(err => console.log(err))
  },

  signIn: (req, res) => {
    // 初始值去除空白字元
    const email = (req.body.email) ? req.body.email.trim() : req.body.email
    const password = (req.body.password) ? req.body.password.trim() : req.body.password

    // 檢查資料
    if (!email || !password) {
      return res.json({ status: 'error', message: '所有欄位均不能為空白' })
    }

    // 檢查 user 是否存在、密碼是否正確
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return res.status(401).json({ status: 'error', message: '此帳號不存在' })
        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({ status: 'error', message: '帳密錯誤' })
        }

        // 簽發 token
        const payload = { id: user.id }
        const token = jwt.sign(payload, process.env.JWT_SECRET)
        return res.json({
          status: 'success',
          message: '登入成功',
          token: token,
          user: {
            id: user.id, name: user.name, email: user.email, isAdmin: Boolean(Number(user.role))
          }
        })
      })
  }
}

module.exports = userController
