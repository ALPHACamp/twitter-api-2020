const passport = require('passport')
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const { User, Tweet } = require('../models')

// JWT strategy

const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = 'SimpleTwitterSecret'

const strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
  try {
    const user = await User.findByPk(jwt_payload.id, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
    if (!user) return next(null, false)
    return next(null, user)
  } catch (error) {
    next(error, false)
  }
})
passport.use(strategy)

module.exports = passport