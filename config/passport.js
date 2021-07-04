const passport = require('passport')
const passportJWT = require('passport-jwt')
const ExtractJWT = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET

let strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
  User.findByPk(jwt_payload.id, {
    include: [
      { model: Tweet, as: 'LikedTweets' },
      { model: User, as: 'Followings' },
      { model: User, as: 'Followers' }
    ]
  })
    .then(user => {
      if (!user) return next(null, false)
      return next(null, user)
    })
})
passport.use(strategy)

module.exports = passport