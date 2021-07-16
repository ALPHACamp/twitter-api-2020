const passport = require('passport')
const passportJwt = require('passport-jwt')
const ExtractJwt = passportJwt.ExtractJwt
const JwtStrategy = passportJwt.Strategy
const db = require('../models')
const Admin = db.Admin
const User = db.User

let jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'numberFive',
}

let strategy = new JwtStrategy(jwtOptions, (jwt_payload, done) => {
  return User.findByPk(jwt_payload.id).then((user) => {
    if (!user) {
      return done(null, false)
    }
    return done(null, user.toJSON())
  })
})

passport.use(strategy)

module.exports = passport
