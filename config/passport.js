const passport = require('passport')
const passportJWT = require('passport-jwt')
const { User, Tweet } = require('../models')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

// JWT設定
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

const strategy = new JWTStrategy(jwtOptions, async (jwtPayload, next) => {
  const user = await User.findByPk(jwtPayload.id, {
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' },
      { model: Tweet, as: 'RepliedTweets' },
      { model: Tweet, as: 'LikedTweets' }
    ]
  })
  if (!user) return next(null, false)
  return next(null, user)
})
passport.use(strategy)

module.exports = passport
