const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Reply, Like } = require('../models')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

// for JWT
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'authenticate'
}

// LocalStrategy
passport.use(new LocalStrategy(
  // set Field, use email and password
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, account, password, cb) => {
    return User.findOne({ where: { account } })
      .then(user => {
        if (!user) throw new Error('帳號不存在!')
        bcrypt.compare(password, user.password)
          .then(res => {
            if (!res) throw new Error('密碼不正確!')
            return cb(null, user)
          })
          .catch(err => cb(err))
      })
      .catch(err => cb(err))
  }
))

// JWT auth
passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id, {
    include: [
      // 看要include那些
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' },
      { model: Reply },
      { model: Like }
    ]
  })
    .then(user => cb(null, user.toJSON()))
    .catch(err => cb(err))
}))

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  return User.findByPk(id, {
    include: [
      // 看要include那些 這邊應該不用動, seesion: false 了
    ]
  })
    .then(user => {
      user = user.toJSON()
      return cb(null, user)
    })
    .catch(err => cb(err))
})
module.exports = passport
