const bcrypt = require('bcryptjs')
const { User } = require('../models')
// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let adminController = {
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
}

module.exports = adminController
