const passport = require('passport')
const ExtractJwt = require('passport-jwt').ExtractJwt
const JwtStrategy = require('passport-jwt').Strategy
const { User } = require('../models/index')

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET

passport.use(new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
  try {
    const user = await User.findByPk(jwt_payload.id)
    if (!user) {
      return done(null, false)
    }
    return done(null, user)
  } catch (err) {
    return done(err, false)
  }
}))

module.exports = passport