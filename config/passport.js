const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

const { User, Like } = require('../models')

// set up Local Passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true // 把 req pass 給 callback (下面那個)
  },
  // authenticate user
  (req, account, password, cb) => {
    User.findOne({ where: { account } })
      .then(user => {
        if (!user) throw new Error('帳號不存在！')
        bcrypt.compare(password, user.password)
          .then(res => {
            if (!res) throw new Error('帳號或密碼輸入錯誤！')
            return cb(null, user)
          })
          .catch(err => cb(err, false))
      })
      .catch(err => cb(err, false))
  }
))

const jwtOptions = {
  // jwtFromRequest -> 從哪找到這 token
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}
passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id, {
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' },
      { model: Like }
    ]
  })
    .then(user => cb(null, user))
    .catch(err => cb(err))
}))

module.exports = passport
