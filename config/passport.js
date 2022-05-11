const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const { User, Tweet, Identity } = require('../models')

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JwtStrategy(jwtOptions, async function (jwtPayload, cb) {
  try {
    const user = await User.findByPk(jwtPayload.id, {
      include: [
        { model: Tweet, as: '' },
        { model: Identity, as: '' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
    cb(null, user)
  } catch (err) {
    cb(err)
  }
}))

module.exports = passport
