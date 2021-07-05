const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let userController = {
  signIn: (req, res, next) => {
    if (!req.body.account || !req.body.password) {
      throw new Error('請輸入必填項目')
    }

    User.findOne({
      where: { account: req.body.account },
    })
      .then((user) => {
        if (!user) return res.status(401).json({ status: 'error', message: '此使用者尚未註冊' })

        if (!bcrypt.compareSync(req.body.password, user.password)) {
          throw new Error('密碼輸入錯誤')
        }

        var payload = { id: user.id }
        var token = jwt.sign(payload, process.env.JWT_SECRET)
        return res.json({
          status: 'success',
          message: 'ok',
          token: token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            account: user.account,
            role: user.role,
          },
        })
      })
      .catch((err) => next(err))
  },

  signUp: (req, res, next) => {
    if (!req.body.account || !req.body.password) {
      throw new Error('請輸入必填項目')
    }
    if (req.body.passwordCheck !== req.body.password) {
      throw new Error('兩次密碼輸入不同！')
    } else {
      User.findOne({
        where: {
          $or: { email: req.body.email, account: req.body.account },
        },
      })
        .then((user) => {
          if (user) {
            if (user.email === req.body.email) {
              throw new Error('信箱重複！')
            }
            if (user.account === req.body.account) {
              throw new Error('帳號重複！')
            }
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              account: req.body.account,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
            }).then((user) => {
              return res.json({ status: 'success', message: '成功註冊帳號！' })
            })
          }
        })
        .catch((err) => next(err))
    }
  },
}

module.exports = userController
