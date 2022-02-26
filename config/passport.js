const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')

const { User, Tweet } = require('../models')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, account, password, cb) => {
    User.findOne({ where: { account } })
      .then(user => {
        if (!user) return cb(null, { data: { status: 'error', message: "Account didn't exist!" } })

        bcrypt.compare(password, user.password).then(res => {
          if (!res) return cb(null, { data: { status: 'error', message: 'Password incorrect!' } })

          return cb(null, user)
        })
      })
  }
))

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id, {
    include: [
      { model: User, as: 'Followings' },
      { model: User, as: 'Followers' },
      { model: Tweet, as: 'LikedTweets' }
    ]
  })
    .then(user => {
      cb(null, user.toJSON())
      return null
    })
    .catch(err => {
      cb(err)
      return null
    })
}))

module.exports = passport
