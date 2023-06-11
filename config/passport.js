const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User } = require('../models')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const { newErrorGenerate } = require('../helpers/newError-helper')
// set up Passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'account',
    passwordField: 'password'
  },
  // authenticate user
  // 登入時驗證使用者帳密
  async (account, password, cb) => {
    try {
      const user = await User.findOne({ where: { account } })
      if (!user) newErrorGenerate('帳號不存在！', 404)
      const res = await bcrypt.compare(password, user.password)
      if (!res) newErrorGenerate('帳號不存在！', 404)
      return cb(null, user)
    } catch (err) {
      return cb(err)
    }
  }))
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || null
}
// 每次req都驗證token
passport.use(new JWTStrategy(jwtOptions, async (jwtPayload, cb) => {
  try {
    const user = await User.findByPk(jwtPayload.id, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
    return cb(null, user)
  } catch (err) {
    return cb(err)
  }
}))

module.exports = passport
