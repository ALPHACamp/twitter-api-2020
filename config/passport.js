const passport = require('passport')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

const { User } = require('../models')

const strategy = new JwtStrategy(jwtOptions, async function (
  jwt_payload,
  next
) {
  const user = await User.findByPk(jwt_payload.id, {
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
  if (!user) return next(null, false)
  return next(null, user)
})

passport.use(strategy)

module.exports = passport
