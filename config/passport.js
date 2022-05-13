const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User } = require('../models')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password'
  },
  (account, password, done) => {
    User.findOne({ where: { account }})
      .then(user => {
        if (!user) throw new Error("User didn't exists!")
        if (!bcrypt.compareSync(password, user.password)) throw new Error('Email or Password Error!')
        return done(null, user)
      })
      .catch(err => done(err, false))
  }
))

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}
passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id)
  .then(user => cb(null, user))
  .catch(err => cb(err))
}))
module.exports = passport