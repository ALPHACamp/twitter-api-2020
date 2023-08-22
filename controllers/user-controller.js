const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userController = {
  signUp: (req, res, next) => {
    const { name, account, email, password, checkPassword } = req.body
    if (!name || !account || !email || !password || !checkPassword) throw new Error('所有欄位皆為必填！')
    if (name.length > 50) throw new Error('暱稱字數超出上限！')
    if (password !== checkPassword) throw new Error('密碼與確認密碼不符合！')
    return Promise.all([
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } })
    ])
      .then(([userA, userB]) => {
        if (userA) throw new Error('email已重複註冊！')
        if (userB) throw new Error('account已重複註冊！')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        name,
        account,
        email,
        password: hash
      }))
      .then(userData => res.json({
        status: 'success',
        data: { user: userData }
      }))
      .catch(err => next(err))
  }
}

module.exports = userController
