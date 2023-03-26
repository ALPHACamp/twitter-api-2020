const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const passportJWT = require('passport-jwt')
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
        if (!user) return cb(null, false, { status: 423, message: '帳號不存在!' })
        if (user.dataValues.role !== 'user') return cb(null, false, { status: 423, message: '帳號不存在!' })

        bcrypt.compare(password, user.password).then(res => {
          if (!res) return cb(null, false, { status: 402, message: '帳號或密碼錯誤!' })

          return cb(null, user)
        }).catch(err => cb(err))
      }).catch(err => cb(err))
  }
))

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'secret'
}

passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id)
    .then(user => cb(null, user))
    .catch(err => cb(err))
}))

module.exports = passport
