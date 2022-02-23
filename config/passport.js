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
  async (account, password, cb) => {
    try {
      const user = await User.find({ where: { account } })
      if (!user) throw new Error('Account or Password is wrong!')
      const res = await bcrypt.compare(password, user.password)
      if (!res) throw new Error('Account or Password is wrong!')
      return cb(null, user)
    } catch (err) {
      return cb(err)
    }
  }
))

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}
passport.use(new JWTStrategy(jwtOptions, async (jwtPayload, cb) => {
  try {
    // 提取當前 user 資料
    const user = await User.findByPk(jwtPayload.id, {
      include: []
    })
    cb(null, user)
  } catch (err) {
    cb(err)
  }
}))

module.exports = passport
