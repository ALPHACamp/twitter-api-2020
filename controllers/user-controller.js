const jwt = require('jsonwebtoken')
const { User } = require('../models')
const bcrypt = require('bcryptjs')

const userController = {
  login: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '10d' })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.checkPassword) throw new Error('密碼與確認密碼不符，請重新輸入')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('此Email已被註冊！')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        account: req.body.account,
        email: req.body.email,
        password: hash
      }))
      .then(user => {
        res.json({ status: 'success', user })
        console.log(user.toJSON())
      })
      .catch(err => next(err))
  }
}

module.exports = userController
