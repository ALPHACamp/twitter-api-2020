const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

// set up Passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'account',
    passwordField: 'password',
    session: false
  },
  // authenticate user
  (account, password, cb) => {
    User.findOne({ where: { account } })
      .then(user => {
        if (!user) cb(new Error('帳號不存在！'))
        bcrypt.compare(password, user.password).then(res => {
          if (!res) cb(new Error('帳號或密碼錯誤！'))
          return cb(null, user)
        })
      })
      .catch(err => cb(err))
  }
))
// set up jwtStrategy
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}
passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id)
    .then(user => cb(null, user))
    .catch(err => cb(err))
}))

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id).then(user => cb(null, user.toJSON()))
    .catch(err => cb(err))
})
module.exports = passport
