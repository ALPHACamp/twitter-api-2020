const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

// localStrategy
passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password'
  },
  // localStrategy
  async (account, password, cb) => {
    try {
      const user = await User.findOne({ where: { account } })
      if (!user) throw new Error('帳號不存在!')

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) throw new Error('密碼輸入錯誤')

      return cb(null, user)
    } catch (err) {
      return cb(err, null)
    }
  }
))

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

// jwtStrategy
passport.use(new JWTStrategy(jwtOptions, async (jwtPayload, cb) => {
  try {
    const user = await User.findByPk(jwtPayload.id)
    return cb(null, user)
  } catch (err) {
    return cb(err, null)
  }
}))

module.exports = passport
