const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

const ExtractJWT = passportJWT.ExtractJwt
const JWTStrategy = passportJWT.Strategy

// local strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },

  (req, account, password, cb) => {
    User.findOne({ where: { account } })
      .then(user => {
        if (!user) return cb(Error('User does not exist!'))
        bcrypt.compare(password, user.password)
          .then(res => {
            if (!res) return cb(Error('Incorrect account or password!'))
            return cb(null, user)
          })
      })
  }
))

// jwt strategy
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id)
    .then(user => {
      if (!user) return cb(null, false)
      cb(null, user)
    })
    .catch(err => cb(err))
})
)

module.exports = passport
