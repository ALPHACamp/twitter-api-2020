const passport = require('passport')

const db = require('../models')
const User = db.User
const Tweet = db.Tweet

// JWT
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET

let strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
  const user = await User.findByPk(jwt_payload.id, {
    include: [
      { model: Tweet, as: 'RepliedTweets' },
      { model: Tweet, as: 'LikedTweets' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' },
      { model: User, as: 'Subscribers' },
      { model: User, as: 'Subscriptions' }
    ]
  })

  if (!user) return next(null, false)
  return next(null, user)
})
passport.use(strategy)

module.exports = passport
