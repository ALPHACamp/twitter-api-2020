const bcrypt = require('bcryptjs')
const { User } = require('../models')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password'
  },
  (account, password, cb) => {
    User.findOne({ where: { account } })
      .then(user => {
        if (!user) return cb(null, false)

        bcrypt.compare(password, user.password).then(res => {
          if (!res) return cb(null, false)

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
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
    .then(user => cb(null, user))
    .catch(err => cb(err))
}))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  }).then(user => { cb(null, user.toJSON()) })
    .catch(err => cb(err))
})

module.exports = passport
