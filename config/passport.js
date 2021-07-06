const passport = require('passport')
// const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())
  passport.serializeUser((user, cb) => {
    cb(null, user.id)
  })
  passport.deserializeUser((id, cb) => {
    User.findByPk(id).then(user => {
      user = user.toJSON()
      return cb(null, user)
    })
  })

  const jwtOptions = {}
  jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
  jwtOptions.secretOrKey = process.env.JWT_SECRET

  const strategy = new JwtStrategy(jwtOptions, function (payload, next) {
    User.findByPk(payload.id, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    }).then(user => {
      if (!user) return next(null, false)
      return next(null, user)
    })
  })
  passport.use(strategy)
}
