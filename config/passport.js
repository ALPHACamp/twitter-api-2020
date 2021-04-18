const db = require('../models')
const User = db.User
const passport = require('passport')

// JWT
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET

const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
  User.findByPk(jwt_payload.id, {
    include: [
      { model: db.Tweet, as: 'LikedTweets' },
      { model: User, as: 'Followings' },
      { model: User, as: 'Followers' }
    ]
  }).then(user => {
    if (!user) return next(null, false)
    return next(null, user)
  })
})

passport.use(strategy)

module.exports = passport
