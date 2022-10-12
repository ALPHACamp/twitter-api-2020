const { User } = require('../models')

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const bcrypt = require('bcryptjs')

passport.use(new LocalStrategy({
  usernameField: 'account',
  passwordField: 'password'
}, async (account, password, cb) => {
  try {
    const user = await User.findOne({ where: { account } })
    if (!user) {
      const err = new Error('Incorrect account or password.')
      err.status = 401
      throw err
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      const err = new Error('Incorrect account or password.')
      err.status = 401
      throw err
    }
    return cb(null, user)
  } catch (err) {
    return cb(err, false)
  }
}))

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true
}

passport.use(new JWTStrategy(jwtOptions, async (req, payload, cb) => {
  try {
    const user = await User.findByPk(payload.id, {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    })
    if (user) {
      req.user = user.toJSON()
      return cb(null, user)
    } else {
      cb(null, false)
    }
  } catch (err) {
    cb(err, false)
  }
}))

module.exports = passport
