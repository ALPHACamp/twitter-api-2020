const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      res.json({
        status: 'success',
        token,
        user: userData
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (!account || !name || !email || !password || !checkPassword) throw new Error('所有欄位皆為必填')
    if (password !== checkPassword) throw new Error('密碼與確認密碼不相符！')
    return Promise.all([
      User.findOne({ where: { account }, raw: true }),
      User.findOne({ where: { email }, raw: true })
    ])
      .then(([userFoundByAccount, userFoundByEmail]) => {
        if (userFoundByAccount) throw new Error('account 已被註冊')
        if (userFoundByEmail) throw new Error('Email已被註冊')
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        return User.create({
          account,
          name,
          email,
          password: hash
        })
      })
      .then(newUser => {
        const userData = newUser.toJSON()
        delete userData.password
        res.json({ status: 'success', message: '帳號已成功註冊', newUser: userData })
      })
      .catch(err => next(err))
  }
}
module.exports = userController
