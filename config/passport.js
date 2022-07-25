const passport = require('passport')

const ExtractJwt = require('passport-jwt').ExtractJwt
const JwtStrategy = require('passport-jwt').Strategy
const { User } = require('../models')

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JwtStrategy(jwtOptions, async (payload, next) => {
  try {
    const user = await User.findByPk(payload.id, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })

    if (!user) return next(null, false)
    return next(null, user)
  } catch (err) {
    next(err)
  }
}))

module.exports = passport
