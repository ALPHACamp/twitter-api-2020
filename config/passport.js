const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const passportJWT = require('passport-jwt')
const { User } = require('../models')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

// setup passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, email, password, cb) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return cb(null, false)
        bcrypt.compare(password, user.password).then(res => {
          if (!res) return cb(null, false)
          return cb(null, user)
        })
      })
  }
))

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'alphacamp',
  passReqToCallback: true
}
passport.use(new JWTStrategy(jwtOptions, (req, jwtPayload, cb) => {
  User.findByPk(jwtPayload.id)
    .then(user => {
      console.log(user)
      req.user = user
      cb(null, user)
    })
    .catch(err => cb(err))
}))

module.exports = passport
