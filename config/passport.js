// 載入所需套件
const passport = require('passport')
const passportJwt = require('passport-jwt')
const ExtractJwt = passportJwt.ExtractJwt
const JwtStrategy = passportJwt.Strategy
const { User } = require('../models')

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

// Jwt Strategy setting
passport.use(new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
  const user = (await User.findByPk(jwt_payload.id, {
    attributes: {
      exclude: ['password', 'createdAt', 'updatedAt']
    }
  })).toJSON()
  if (!user) {
    return next(null, false)
  }
  return next(null, user)
}))

// passport exports
module.exports = passport