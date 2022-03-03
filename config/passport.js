const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { User } = require('../models')
const bcrypt = require('bcryptjs')

// JWT
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'test'
}

passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password'
  },
  async (account, password, cb) => {
    try {
      const user = await User.find({ where: { account } })
      if (!user) throw new Error('帳號不存在或密碼錯誤！')
      const res = await bcrypt.compare(password, user.password)
      if (!res) throw new Error('.帳號不存在或密碼錯誤！')
      return cb(null, user)
    } catch (err) {
      return cb(err)
    }
  }
))

passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  return User.findByPk(jwtPayload.id, {
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
    .then(user => {
      if (!user) cb(null, false)
      return cb(null, user.toJSON())
    })
    .catch(err => cb(err))
}))

exports = module.exports = passport
