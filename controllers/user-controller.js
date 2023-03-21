const jwt = require('jsonwebtoken')
const { User } = require('../models')
const bcrypt = require('bcryptjs')
const passport = require('../config/passport')

const userController = {
  login: (req, res, next) => {
    passport.authenticate('local', { session: false, failWithError: true }, (err, user, info) => {
      // err: null & user: false => 400
      if (!err && !user) {
        const error = new Error('輸入資料不可為空值!')
        error.status = 400
        next(error)
      }

      if (err || !user) {
        if (err.status === 401) {
          next(err)
        }
      }
      try {
        const userData = user.toJSON()
        delete userData.password
        const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
        res.json({
          status: 'success',
          data: {
            token
          }
        })
      } catch (err) {
        return next(err)
      }
    })(req, res, next)
  },
  signUp: (req, res, next) => {
    if (!req.body.email.trim() || !req.body.account.trim() || !req.body.name.trim() || !req.body.password.trim() || !req.body.checkPassword.trim()) {
      const error = new Error('輸入資料不可為空值!')
      error.status = 400
      throw error
    }

    if (req.body.password !== req.body.checkPassword) {
      const error = new Error('密碼輸入不相符！')
      error.status = 403
      throw error
    }

    User.findOne({ where: { account: req.body.account } })
      .then(user => {
        if (user) {
          const error = new Error('account 已重複註冊！')
          error.status = 403
          throw error
        }

        return bcrypt.hash(req.body.password, 10)
      })
      .catch(err => next(err))

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) {
          const error = new Error('email 已重複註冊！')
          error.status = 403
          throw error
        }

        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(user => {
        res.json({
          status: 'success'
        })
      })
      .catch(err => next(err))
  }
}
module.exports = userController
