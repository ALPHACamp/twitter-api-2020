const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User } = require('../models')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
// set up Passport strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password'
  },
  // authenticate user
  async (account, password, cb) => {
    try {
      const user = await User.findOne({ where: { account } })
      if (!user) cb(new Error('帳號不存在！'))
      bcrypt.compare(password, user.password).then(res => {
        if (!res) { cb(new Error('帳號或密碼輸入錯誤！')) }

        return cb(null, user)
      })
    } catch (err) {
      return cb(err, false)
    }
  }
))

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true
}

passport.use(new JWTStrategy(jwtOptions, async (req, jwtPayload, cb) => {
  try {
    const user = await User.findByPk(jwtPayload.id, {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    })
    req.user = user
    return cb(null, user)
  } catch (err) {
    return cb(err, false)
  }
}))
// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  return User.findByPk(id, {
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
    .then(user => cb(null, user.toJSON()))
    .catch(err => cb(err))
})
module.exports = passport
