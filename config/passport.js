const passport = require('passport')
const assert = require('assert')
const bcrypt = require('bcrypt-nodejs')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')

const { User, Tweet, Reply } = require('../models')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

// local strategy
const localStrategy = new LocalStrategy({
  usernameField: 'account',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, account, password, next) => {
  try {
    const user = await User.findOne({ where: { account } })
    if (!user) assert(user, '帳號不存在！')
    if (!bcrypt.compareSync(password, user.password)) assert(null, '密碼輸入錯誤！')
    return next(null, user)
  } catch (err) {
    next(err)
  }
})

// JWT設定
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

const jwtStrategy = new JWTStrategy(jwtOptions, async (jwtPayload, next) => {
  try {
    const user = await User.findByPk(jwtPayload.id, {
      include: [
        Reply, Tweet,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Tweet, as: 'LikedTweets' }
      ]
    })
    return next(null, user)
  } catch (err) {
    next(null, err)
  }
})

passport.use(localStrategy)
passport.use(jwtStrategy)

module.exports = passport
