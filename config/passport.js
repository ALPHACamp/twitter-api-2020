const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Tweet, Like } = require('../models')
const passportJWT = require('passport-jwt')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password'
  },
  async (account, password, cb) => {
    try {
      const user = await User.findOne({ where: { account } })
      if (!user) return cb(null, false, { message: '帳號不存在！' }) // 查詢不到user account有誤或帳號不存在！
      const res = await bcrypt.compare(password, user.password)
      if (!res) return cb(null, false, { message: '帳號或密碼有誤！' }) // 密碼有誤
      return cb(null, user)// account 密碼都正確
    } catch (error) {
      cb(error)
    }
  }
))

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JWTStrategy(jwtOptions, async (jwtPayload, cb) => {
  try {
    const user = await User.findByPk(jwtPayload.id, {
      include: [
        { model: Tweet, attributes: ['id'] },
        { model: User, as: 'Followers', attributes: ['id'] },
        { model: User, as: 'Followings', attributes: ['id'] },
        { model: Like, attributes: ['TweetId'] }
      ],
      nest: true
    })
    cb(null, user)
  } catch (error) {
    cb(error)
  }
}))

module.exports = passport
