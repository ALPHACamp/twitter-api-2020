const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
  signUp: (req, res) => {
    // 初始值去除空白字元
    const account = (req.body.account) ? req.body.account.trim() : req.body.account
    const name = (req.body.name) ? req.body.name.trim() : req.body.name
    const email = (req.body.email) ? req.body.email.trim() : req.body.email
    const password = (req.body.password) ? req.body.password.trim() : req.body.password
    const passwordCheck = (req.body.passwordCheck) ? req.body.passwordCheck.trim() : req.body.passwordCheck

    if (!account || !name || !email || !password || !passwordCheck) {
      return res.json({ status: 'error', message: '所有欄位均不能空白' })
    }
    if (passwordCheck !== password) {
      return res.json({ status: 'error', message: '兩次密碼不一致' })
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
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        })
      })
      .then(user => {
        return res.json({ status: 'success', message: '成功建立使用者資料' })
      })
      .catch(err => console.log(err))
  }
}

module.exports = userController
