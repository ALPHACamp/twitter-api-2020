const passport = require('passport')
// const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

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

module.exports = passport
