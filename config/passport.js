const passport = require('passport')
const passportJWT = require('passport-jwt')
const LocalStrategy = require('passport-local')
const { User } = require('../models')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },
  async (req, account, password, cb) => {
    const user = await User.findOne({ where: { account, password } })
    if (!user) return cb(null, false, { message: '帳號或密碼輸入錯誤！' })
    cb(null, user)
  }
))

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}
passport.use(new JWTStrategy(jwtOptions, async (jwtPayload, cb) => {
  try {
    const user = await User.findByPk(jwtPayload.id)
    cb(null, user)
  } catch (err) {
    cb(err)
  }
}))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findByPk(id)
    cb(null, user.toJSON())
  } catch (err) {
    cb(err)
  }
})

module.exports = passport
