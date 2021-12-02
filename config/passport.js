const passport = require('passport')
const db = require('../models')
const User = db.User

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

// setup JWT

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET

let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  User.findByPk(jwt_payload.id, {include: [{ model: Like }]}).then((user) => {
    user = user.toJSON()
    if (!user) return next(null, false)
    return next(null, user)
  })
})
passport.use(strategy)

module.exports = passport
