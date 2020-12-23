const passport = require('passport')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const db = require('../models')
const User = db.User
const Like = db.Like

// set JwtStrategy
let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET

passport.use(new JwtStrategy(jwtOptions, (jwt_payload, done) => {
  User.findByPk(jwt_payload.id, {
    include: [
      Like,
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ],
    attributes: { exclude: ['password'] }
  }).then(user => {
    if (!user) return done(null, false)
    return done(null, user.toJSON())
  })
}))

module.exports = passport
