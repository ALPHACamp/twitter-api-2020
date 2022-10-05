const jwt = require('jsonwebtoken')
const { User } = require('../models')
const bcrypt = require('bcryptjs')
const userServices = {
  signIn: (req, cb) => {
    try {
      const token = jwt.sign(req.user, process.env.JWT_SECRET, { expiresIn: '30d' })
      return cb(null, {
        status: 'success',
        data: {
          token,
          user: req.user
        }
      })
    } catch (err) {
      cb(err)
    }
  },
  signUp: (req, cb) => {
    // 密碼輸入不一致
    if (req.body.password !== req.user.passwordCheck) throw new Error("Passwords doesn't match!")
    return User.findOne({ where: { email: req.body.email } })
      .then(user => {
        // 錯誤處理: user已註冊
        if (user) throw new Error('User already exists!')
        // user未註冊過
        return bcrypt.hash(user.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(newUser => cb(null, { newUser }))
      .catch(err => cb(err))
  }
}
module.exports = userServices
