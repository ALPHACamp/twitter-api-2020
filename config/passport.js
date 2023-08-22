const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
passport.use(
  new LocalStrategy(
    // customize user field
    {
      usernameField: 'account',
      passwordField: 'password',
      passReqToCallback: false
    },
    // authenticate user
    (account, password, cb) => {
      User.findOne({ where: { account } }).then(user => {
        if (!user) {
          return cb(null, false, { message: '帳號或密碼輸入錯誤！' })
        }
        bcrypt.compare(password, user.password).then(res => {
          if (!res) {
            return cb(null, false, { message: '帳號或密碼輸入錯誤！' })
          }
          return cb(null, user)
        })
      })
    }
  )
)
// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser(async (id, cb) => {
  const user = await User.findByPk(id)
  return cb(null, user.toJSON())
})
module.exports = passport
