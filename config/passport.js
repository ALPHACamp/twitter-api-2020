const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User } = require('../models')
const JWTStrategy = passportJWT.Strategy
const ExtractJWWT = passportJWT.ExtractJwt

// 登入
passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, account, password, cb) => {
    User.findOne({ where: { account } })
      .then(user => {
        if (!user) return cb(null, false)
        bcrypt.compare(password, user.password)
          .then(res => {
            if (!res) return cb(null, false)
          })
        return cb(null, user)
      })
  }
))
// 註冊
const jwtOptions = {
  jwtFromRequest: ExtractJWWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}
passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id, {
    include: [
      { model: User, as: 'Followers', attributes: ['id'] },
      { model: User, as: 'Followings', attributes: ['id'] }
    ]
  })
    .then(user => {
      user = user.toJSON()
      return cb(null, user)
    })
    .catch(err => cb(err))
}))
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  return User.findByPk(id)
    .then(user => {
      console.log('deserialize', user)
      cb(null, user.toJSON())
    })
    .catch(err => cb(err))
})

module.exports = passport
