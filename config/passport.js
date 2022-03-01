const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcrypt')

const { User } = require('../models')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

// localStrategy
passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password',
    session: false
  },
  (account, password, cb) => {
    User.findOne({ where: { account } })
      .then(user => {
        if (!user) return cb(Error('查無此帳號!'), false)
        bcrypt.compare(password, user.password).then(res => {
          if (!res) return cb(Error('密碼輸入錯誤！'), false)
          return cb(null, user)
        })
      })
      .catch(err => cb(err))
  }
))
// jwtStrategy
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'alphacamp' // 因應雲端的自動化測試所做的設定
}
passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id)
    .then(user => cb(null, user))
    .catch(err => cb(err))
}))

module.exports = passport
