const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')

const { User } = require('../models')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  return User.findByPk(jwtPayload.id)
    .then(user => {
      if (!user) cb(null, false)
      return cb(null, user.toJSON())
    })
    .catch(err => cb(err))
}))

// passport.serializeUser((user, cb) => {
//   cb(null, user.id)
// })

// passport.deserializeUser((id, cb) => {
//   User.findByPk(id)
//     .then(user => cb(null, user.toJSON()))
//     .catch(err => cb(err))
// })

exports = module.exports = passport
