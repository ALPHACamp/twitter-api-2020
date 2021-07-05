const db = require('../models')
const { User } = db
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userController = {
  signUp: async (req, res) => {
    try {
      const { account, name, email, password, passwordConfirm } = req.body
      const message = []
      // check all inputs are required
      if (!account || !name || !email || !password || !passwordConfirm) {
        message.push('所有欄位都是必填')
      }
      // check account length and type
      if (name && !validator.isByteLength(name, { min: 0, max: 50 })) {
        message.push('名稱長度必須小於50字')
      }
      // check name length and type
      if (account && !validator.isByteLength(account, { min: 0, max: 20 })) {
        message.push('帳號長度必須小於20字')
      }
      // check email validation
      if (email && !validator.isEmail(email)) {
        message.push('請輸入有效的信箱')
      }
      // check password length and type
      if (password && !validator.isByteLength(password, { min: 8, max: 15 })) {
        message.push('請輸入長度介於 8-15 的密碼')
      }
      // check password and passwordConfirm
      if (password && (password !== passwordConfirm)) {
        message.push('密碼與確認密碼不相符')
      }
      if (message.length) {
        return res.status(400).json({ status: 'error', message })
      }
      const [inputEmail, inputAccount] = await Promise.all([User.findOne({ where: { email } }), User.findOne({ where: { account: `@${account}` } })])
      const errorMessage = []
      if (inputEmail) {
        errorMessage.push('此信箱已註冊！')
      }
      if (inputAccount) {
        errorMessage.push('此帳號已註冊！')
      }
      if (errorMessage.length) {
        return res.status(409).json({ status: 'error', message: errorMessage })
      }
      await User.create({
        account: `@${account}`,
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      })
      return res.json({ status: 'success', message: '註冊成功！' })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = userController
