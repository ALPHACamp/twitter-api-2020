//必要套件
const passport = require('passport')
const bcrypt = require('bcryptjs')
// DB
const db = require('../models')
const { User, Restaurant, Comment } = db

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = 'alphacamp'

let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  User.findByPk(jwt_payload.id, {
  }).then(user => {
    if (!user) return next(null, false)
    return next(null, user)
  })
})
passport.use(strategy)

module.exports = passport
