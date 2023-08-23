const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User, Like, Tweet } = require('../models')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

// 本地驗證
passport.use(new LocalStrategy({ usernameField: 'account' }, (account, password, cb) => {
  User.findOne({ where: { account } })
    .then(user => {
      if (!user) {
        const err = new Error('帳號不存在！')
        err.status = 404
        throw err
      }
      bcrypt.compare(password, user.password)
        .then(result => {
          if (!result) throw new Error('密碼錯誤！')
          return cb(null, user)
        })
        .catch(err => cb(err, false))
    })
    .catch(err => cb(err, false))
}))

// 利用 jwtPayload 到資料庫找出 user 並傳入 req.user 供後續使用
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}
passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id, {
    include: [
      { model: Like, include: Tweet },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
    .then(user => cb(null, user))
    .catch(err => cb(err, false))
}))

module.exports = passport
