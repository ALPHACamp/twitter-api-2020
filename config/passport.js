/* eslint-disable no-undef */
const passport = require('passport')
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const { User, Tweet, Like } = require('../models')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
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
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true
}
passport.use(new JWTStrategy(jwtOptions, (req, jwtPayload, cb) => {
  User.findByPk(jwtPayload.id, {
    include: [
      Tweet,
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' },
      Like
    ]
  })
    .then(user => {
      req.user = user
      cb(null, user)
    })
    .catch(err => cb(err))
}))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [
      Tweet,
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' },
      Like
    ]
  })
    .then(user => cb(null, user.toJSON()))
    .catch(err => cb(err))
})

module.exports = passport
