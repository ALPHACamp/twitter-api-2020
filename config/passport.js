const passport = require('passport')
const passportJWT = require('passport-jwt')
const db = require('../models/index')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Reply = db.Reply

const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET

const strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
  // jwt_payload: { id: 1, iat: 1614599008 } iat can be used to expire token
  const currentUser = await User.findByPk(jwt_payload.id, {
    include: [
      Tweet,
      Like,
      Reply,
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }]
  }).catch((err) => {

    return next(err, false)
  })
  if (!currentUser) return next(null, false)
  return next(null, currentUser)
})
passport.use(strategy)

module.exports = passport
