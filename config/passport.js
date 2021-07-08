const passport = require('passport')
const passportJwt = require('passport-jwt')
const ExtractJwt = passportJwt.ExtractJwt
const JwtStrategy = passportJwt.Strategy
const db = require('../models')
const Admin = db.Admin
const User = db.User

let jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}

let strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
  if (jwt_payload.isAdmin) {
    return Admin.findByPk(jwt_payload.id).then((admin) => {
      if (!admin) {
        return next(null, false)
      }
      return next(null, admin)
    })
  }
  return User.findByPk(jwt_payload.id).then((user) => {
    if (!user) {
      return next(null, false)
    }
    return next(null, user)
  })
})

passport.use(strategy)

module.exports = passport
