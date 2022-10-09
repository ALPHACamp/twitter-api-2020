const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.use(new LocalStrategy({
  usernameField: 'account',
  passwordField: 'password'
},
(account, password, cb) => {
  User.findOne({ where: { account } })
    .then(user => {
      // if user不存在
      if (!user) return cb(Error('查無此帳號!'), false)
      // 驗證密碼是否正確
      bcrypt.compare(password, user.password).then(res => {
        if (!res) return cb(Error('密碼輸入錯誤！'), false)
        // 密碼正確回傳資料
        return cb(null, user)
      })
    })
}
))
// jwtStrategy
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}
passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id)
    .then(user => cb(null, user))
    .catch(err => cb(err))
}))

module.exports = passport
