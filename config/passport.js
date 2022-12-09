const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const { User } = require('../models')

const jwtOpts = {}
jwtOpts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOpts.secretOrKey = process.env.JWT_SECRET
passport.use(new JwtStrategy(jwtOpts, async (payload, done) => {
  try {
    const user = User.findByPk(payload.id)
    if (!user) return done(null, false)
    return done(null, user)
  } catch (err) {
    return done(err, false)
  }
}))

module.exports = passport
