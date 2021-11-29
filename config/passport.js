if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const passport = require('passport')
const passportJwt = require('passport-jwt')
const ExtractJwt = passportJwt.ExtractJwt
const JwtStrategy = passportJwt.Strategy

const db = require('../models')
const User = db.User

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET
passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
  User.findByPk(jwt_payload.id, {
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  }).then(user => {
    if (!user) {
      return done(null, false)
    }
    return done(null, user)
  })
}));

module.exports = passport