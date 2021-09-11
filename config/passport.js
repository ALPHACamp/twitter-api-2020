const passport = require('passport')
const strategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const localStrategy = new strategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},
  async (req, email, password, done) => {
    try {
      const userInfo = await User.findOne({ where: { email } })
      if (!userInfo) return done(null, false, req.flash('error_messages', '帳號輸入錯誤'))
      if (!bcrypt.compareSync(password, userInfo.password)) return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
      return done(null, userInfo)
    }
    catch (error) {
      console.log(error)
    }
  }
)

function passportSet(passport) {
  passport.use(localStrategy)

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then(user => {
        done(null, user);
      })
      .catch(err => done(null, err))
  });
}

module.exports = passportSet