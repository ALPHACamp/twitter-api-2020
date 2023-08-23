const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Tweet, Reply } = db
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
passport.use(
  new LocalStrategy(
    // customize user field
    {
      usernameField: 'account',
      passwordField: 'password',
      passReqToCallback: false
    },
    // authenticate user
    (account, password, cb) => {
      User.findOne({ where: { account } }).then(user => {
        if (!user) {
          return cb(null, false, { message: '帳號或密碼輸入錯誤！' })
        }
        bcrypt.compare(password, user.password).then(res => {
          if (!res) {
            return cb(null, false, { message: '帳號或密碼輸入錯誤！' })
          }
          return cb(null, user)
        })
      })
    }
  )
)

// jwt
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}
passport.use(
  new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
    User.findByPk(jwtPayload.id)
      .then(user => cb(null, user))
      .catch(err => cb(err))
  })
)
module.exports = passport
