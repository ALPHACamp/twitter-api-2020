const passport = require('passport')

const JWTStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt

const { User } = require('../models')

// JWT strategy
const options = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JWTStrategy(options, async (payload, done) => {
  try {
    const user = await User.findByPk(payload.id)
    if (!user) return done(null, false)
    return done(null, user)
  } catch (error) {
    done(error, false)
  }
}))

module.exports = passport
