const passport = require('passport')
const assert = require('assert')
const bcrypt = require('bcrypt-nodejs')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')

const { User, Tweet, Reply, Like } = require('../models')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

// local strategy
const localStrategy = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, next) => {
  try {
    const user = await User.findOne({ where: { email } })
    if (!user) assert(user, '帳號或密碼輸入錯誤！')
    if (!bcrypt.compareSync(password, user.password)) assert(null, '帳號或密碼輸入錯誤！')
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
        Reply, Tweet, Like,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
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
