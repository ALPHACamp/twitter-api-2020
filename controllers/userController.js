const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Tweet, Like, sequelize, Sequelize } = require('../models/index')
const QueryTypes = Sequelize.QueryTypes
const { isEmailValid } = require('../utils/helpers')

module.exports = {
  createUser: async (req, res, next) => {
    const errors = []
    //check required fields
    const { account, name, email, password, checkPassword } = req.body
    if (!account.trim() || !name.trim() || !email.trim() || !password.trim() || !checkPassword.trim()) {
      errors.push('所有欄位皆為必填')
    }
    //check if password matches checkPassword
    if (password !== checkPassword) {
      errors.push('密碼和確認密碼不相符')
    }
    //check if the email's format is valid
    if (!isEmailValid(email)) {
      errors.push('Email格式錯誤')
    }

    try {
      const [duplicateAccount, duplicateEmail] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])
      if (duplicateAccount) {
        errors.push('帳號重複')
      }
      if (duplicateEmail) {
        errors.push('Email已被註冊')
      }
      if (errors.length) {
        return res.json({ status: 'error', message: errors })
      }

      const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      await User.create({ account, name, email, password: hash })
      return res.json({ status: 'success', message: '註冊成功' })
    } catch (err) {
      console.log(err)
      return res.status(500).json({ status: 'error', message: '內部伺服器錯誤' })
    }
  },
}