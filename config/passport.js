const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallBack: true
},
(req, email, password, cb) => {
  User.findOne({ where: { email } })
    .then(user => {
      // if user不存在
      if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤!'))
      // 驗證密碼是否正確
      bcrypt.compare(password, user.password).them(res => {
        if (!res) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤!'))
        // 密碼正確回傳資料
        return cb(null, user)
      })
    })
}

))
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id)
    .then(user => {
      console.log(user)
      return cb(null, user)
    })
})
module.exports = passport
