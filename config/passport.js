const passport = require('passport')
const LocalStrategy = require('passport-local')
const { User } = require('../models')

// setup passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, email, password, cb) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return cb(null, false)
        if (password !== user.password) return cb(null, false)
        return cb(null, user)
      })
  }
))

module.exports = passport
