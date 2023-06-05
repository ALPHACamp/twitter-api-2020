const bcrypt = require('bcryptjs')
const { Sequelize, Op } = require('sequelize')

const { User } = require('../models')
const userServices = {
  signUp: (req, cb) => {
    const { name, account, email, password, checkPassword } = req.body
    // check if password equals checkPassword
    if (password !== checkPassword) throw new Error('第二次輸入密碼有誤')
    Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })
    ])
      .then(([user1, user2]) => {
        if (user1) {
          throw new Error('account 已重複註冊！')
        }
        if (user2) {
          throw new Error('email 已重複註冊！')
        }
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        return User.create({
          name,
          account,
          email,
          password: hash,
          role: 'user'
        })
      })
      .then(() => cb(null))
      .catch(err => cb(err))
  }
}

module.exports = userServices
