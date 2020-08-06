const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const passportJWT = require('passport-jwt')
const JwtStrategy = passportJWT.Strategy
const ExtractJwt = passportJWT.ExtractJwt
const db = require('../models')
const { User, Tweet } = db

passport.use(new LocalStrategy(
  { usernameField: 'account', passReqToCallback: true },
  (req, account, password, done) => {
    User.findOne({ where: { account } })
      .then(user => {
        if (!user) {
          return done(null, false, req.flash('error_msg', `Account doesn't exist.`))
        }
        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              return done(null, false, req.flash('error_msg', 'Account or password incorrect.'))
            }
            return done(null, user)
          })
          .catch(err => done(err, false))
      })
  }))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findByPk(id, {
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' },
      { model: Tweet, as: 'LikedTweets' },
    ]
  }).then(user => {
    if (!user) return done(null, false)
    return done(null, user)
  })
})

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  // put data in req.user
  User.findByPk(jwt_payload.id, {
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' },
      { model: Tweet, as: 'LikedTweets' },
    ]
  }).then(user => {
    if (!user) return next(null, false)
    return next(null, user)
  })
}))


module.exports = passport