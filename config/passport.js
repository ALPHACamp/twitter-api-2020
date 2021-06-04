const db = require('../models')
const User = db.User
const passport = require('passport')

// JWT
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET

const strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  User.findByPk(jwt_payload.id, {
    include: [
      { model: db.Tweet, as: 'LikedTweets' },
      { model: User, as: 'Followings' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Authors' }
    ]
  }).then(user => {
    if (!user) return next(null, false)
    return next(null, user)
  }).catch(e => {
    return next(e, false)
  })
})

passport.use(strategy)

module.exports = passport
