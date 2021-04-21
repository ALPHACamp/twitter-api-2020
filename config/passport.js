const passport = require('passport')
const passportJWT = require('passport-jwt')

const db = require('../models/index')

const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const User = db.User

// setup Jwt strategy
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.JWT_SECRET

passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
  User.findByPk(jwtPayload.id)
    .then(user => {
      if (!user) return done(null, false)
      return done(null, user.toJSON())
    })
    .catch(error => {
      return done(error, false)
    })
}))

module.exports = passport
