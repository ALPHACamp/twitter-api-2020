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
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },

  (req, email, password, cb) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return cb(Error('User does not exist!'))
        bcrypt.compare(password, user.password)
          .then(res => {
            if (!res) return cb(Error('Incorrect email or password!'))
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
  User.findOne(jwtPayload.id, { id: jwtPayload.id })
    .then(user => cb(null, user))
    .catch(err => cb(err))
})
)

module.exports = passport
