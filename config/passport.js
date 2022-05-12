const passport = require('passport')
const { User, Tweet } = require('../models')

// JWT Authentication
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JwtStrategy(jwtOptions, (jwt_payload, cb) => {
  User.findByPk(jwt_payload.id, {
    include: [
      { model: Tweet, as: 'LikedTweets' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
  .then(user => cb(null, user))
    .catch(err => cb(err))
}))

module.exports = passport
