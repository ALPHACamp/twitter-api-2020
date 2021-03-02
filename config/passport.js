const passport = require('passport')
const { User, Tweet } = require('../models')

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET

passport.use(new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    User.findByPk(jwt_payload.id, {
      include: [
        // { model: User, as: 'Followers' },
        // { model: User, as: 'Followings' },
        // { model: Tweet, as: 'LikedTweets' },
        // { model: Tweet, as: 'ReplyTweets' }
      ]
    }).then(user => {
      if (!user) return next(null, false)
      return next(null, user)
    })
  }))

module.exports = passport