const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Like, Followship } = require('../models') // 之後要改成{ User } = require('../models')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  async (account, password, cb) => {
    try {
      const user = await User.findOne({ where: { account } })
      if (!user) throw new Error('帳號不存在!')
      const comparePassword = await bcrypt.compare(password, user.password)
      if (!comparePassword) throw new Error('密碼錯誤!')
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

passport.use(new JWTStrategy(jwtOptions, async (jwtPayload, cb) => {
  try {
    const user = await User.findByPk(jwtPayload.id, {
      include: [
        { model: Tweet, as: 'LikedTweets' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
    return cb(null, user)
  } catch (err) {
    return cb(err, null)
  }
}))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findByPk(id, {
      include: [
        { model: Tweet, as: 'Tweets' },
        { model: Followship, as: 'Followers' },
        { model: Followship, as: 'Followings' }
      ]
    })
    return cb(null, user.toJSON())
  } catch (err) {
    return cb(err, null)
  }
})

module.exports = passport
