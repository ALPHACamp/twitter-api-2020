const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User } = require('../models')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  async (req, account, password, cb) => {
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
      const user = await User.findOne({ where: { account } })
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

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' },
      { model: Restaurant, as: 'LikedRestaurants' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
    .then(user => cb(null, user))
    .catch(err => cb(err))
}))

module.exports = passport
