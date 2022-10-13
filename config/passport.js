if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const passport = require('passport')
const bcrypt = require('bcryptjs')
const { User } = require('../models')
const LocalStrategy = require('passport-local').Strategy
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

// LocalStrategy
passport.use(new LocalStrategy({
  usernameField: 'account'
}, (account, password, cb) => {
  // signin authenticate
  User.findOne({ where: { account } })
    .then(user => {
      if (!user) throw new Error('尚未註冊')
      bcrypt.compare(password, user.password)
        .then(result => {
          if (!result) throw new Error('帳號或密碼錯誤')
          cb(null, user)
        })
        .catch(error => cb(error))
    })
    .catch(error => cb(error))
}))

// JWT Strategy
// set jwt options
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}
// check token
passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id, {
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
    .then(user => {
      cb(null, user)
    })
    .catch(error => cb(error))
}))

module.exports = passport
