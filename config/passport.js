const passport = require('passport')

const ExtractJwt = require('passport-jwt').ExtractJwt
const JwtStrategy = require('passport-jwt').Strategy
const { User } = require('../models')

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true
}

passport.use(new JwtStrategy(jwtOptions, async (req, payload, next) => {
  try {
    const user = await User.findByPk(payload.id, {
      include: [
        {
          model: User,
          as: 'Followers',
          attributes: ['id', 'name', 'account', 'avatar']
        },
        {
          model: User,
          as: 'Followings',
          attributes: ['id', 'name', 'account', 'avatar']
        }
      ],
      attributes: { exclude: ['password'] }
    })

    if (!user) return next(null, false)
    req.user = user
    return next(null, user.toJSON())
  } catch (err) {
    next(err)
  }
}))

module.exports = passport
