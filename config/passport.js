const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

// 本地驗證
passport.use(new LocalStrategy({ usernameField: 'account', session: false }, (account, password, cb) => {
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

// 序列化、反序列化
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id)
    .then(user => {
      user = user.toJSON()
      return cb(null, user)
    })
})

module.exports = passport
