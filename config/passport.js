const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User } = require('../models')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password'
  },
  (account, password, cb) => {
    User.findOne({ where: { account } })
      .then(user => {
        // 如果使用者不存在
        if (!user) return cb(null, false, { message: '帳號或密碼輸入錯誤!' })
        // 如果使用者密碼錯誤
        bcrypt.compare(password, user.password).then(res => {
          if (!res) return cb(null, false, { message: '帳號或密碼輸入錯誤!' })
        })
        // 認證成功，回傳user資訊
        return cb(null, user, { message: '登入成功!' })
      })
      .catch(error => cb(error))
  }
))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  return User.findByPk(id)
    .then(user => cb(null, user.toJSON()))
    .catch(err => cb(err))
})

module.exports = passport