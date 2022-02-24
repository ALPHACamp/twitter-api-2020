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
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, account, password, cb) => {
    return User.findOne({ where: { account } })
      .then(user => {
        if (!user) return cb(null, false)
        return bcrypt.compare(password, user.password).then(res => {
          if (!res) return cb(null, false)
          return cb(null, user)
        })
      })
  }
))

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  return User.findByPk(jwtPayload.id, {
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
    .then(user => {
      return cb(null, user)
    })
    .catch(err => {
      return cb(err)
    })
}))

module.exports = passport
