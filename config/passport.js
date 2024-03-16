const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const passportJWT = require('passport-jwt')
const JwtStrategy = passportJWT.Strategy
const ExtractJwt = passportJWT.ExtractJwt
const { User } = require('../models')

passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password'
  },
  async (account, password, done) => {
    try {
      const user = await User.findOne({ where: { account } })
      if (!user) {
        const err = new Error('This account has not registered.')
        err.status = 401
        throw err
      }
      const isMatched = await bcrypt.compare(password, user.password)
      if (!isMatched) {
        const err = new Error('Account or password is not correct.')
        err.status = 401
        throw err
      }
      return done(null, user)
    } catch (err) { return done(err) }
  }
))
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
  try {
    const user = await User.findByPk(jwtPayload.id)
    if (user) return done(null, user)
  } catch (err) { return done(err, false) }
}))

module.exports = passport
