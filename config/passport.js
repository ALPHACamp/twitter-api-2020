const passport = require('passport')
const LocalStrategy = require('passport-local')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const bcrypt = require('bcryptjs')
// JWT set up
const passportJWT = require('passport-jwt')
const ExtractJWT = passportJWT.ExtractJwt
const JWTStrategy = passportJWT.Strategy

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  async (req, email, password, cb) => {
    // User.findOne({ where: { email } })
    //   .then(user => {
    //     if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
    //     bcrypt.compare(password, user.password)
    //       .then(res => {
    //         if (!res) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
    //         return cb(null, user)
    //       })
    //   })
    try {
      const user = await User.findOne({ where: { email } })
      if (!user) {
        throw new Error('帳號不存在')
      }
      const isMath = await bcrypt.compare(password, user.password)
      if (!isMath) {
        throw new Error('輸入密碼錯誤')
      }
      return cb(null, user)
    } catch (err) { cb(err) }
  }
))

passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id, {
    include: [
      { model: Tweet, as: 'RepliedTweets' },
      { model: Tweet, as: 'LikedTweets' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
    .then(user => cb(null, user))
    .catch(err => cb(err))
}))

module.exports = passport
