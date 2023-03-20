const passport = require('passport')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
// const { User } = require('../models')

const userController = {
  signin: [
    passport.authenticate('local', {
      session: false
    }),
    (req, res, next) => {
      try {
        // 登入完後要發出jwt token
        const token = jwt.sign(helpers.getUser(req), process.env.JWT_SECRET, { expiresIn: '1d' }) // expiresIn: token的有效日期是一天
        res.json({
          token,
          user: helpers.getUser(req)
        })
      } catch (err) {
        next(err)
      }
    }
  ]
}

module.exports = userController
