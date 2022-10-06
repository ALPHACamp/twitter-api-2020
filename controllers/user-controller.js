const bcrypt = require('bcrypt-nodejs')

const { User } = require('../models')

const userController = {
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) throw new Error('密碼輸入錯誤，請重新確認')

    User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('此信箱已註冊過，請使用其他信箱')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash
      }))
      .then(user => res.json({status: 'success', data: user}))
      .catch(err => next(err))
  }
}

module.exports = userController
