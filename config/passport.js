const passport = require('passport')
const passportJWT = require('passport-jwt')

const { User } = require('../models')

const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'JWTSecretIsWeird'
}

passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, next) => {
  const user = await User.findByPk(jwtPayload.id)
  if (!user) {
    return next(null, false)
  }
  return next(null, user)
}))

module.exports = passport
