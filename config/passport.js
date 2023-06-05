const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { User } = require('../models')

// LocalStrategy Setting

// passport.use(new LocalStrategy(
//   ({ usernameField: 'account', passwordField: 'password', passReqToCallback: true }),
//   async (req, account, password, cb) => {
//     try {
//       const users = await User.findAll()
//       console.log(users)
//       const user = await User.findOne({ where: { account } })
//       if (!user) {
//         console.log('帳號或密碼輸入錯誤！')
//         return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
//       }
//       const isMatch = await bcrypt.compare(password, user.password)
//       if (!isMatch) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
//       return cb(null, user)
//     } catch (error) {
//       cb(error)
//     }
//   }
// ))

passport.use(new LocalStrategy(({
  usernameField: 'account',
  passwordField: 'password',
  passReqToCallback: true
}), async (req, account, password, done) => {
  try {
    // email error
    const user = await User.findOne({ where: { account } })
    if (!user) return done(null, false, req.flash('error_messages', 'Account or password entered incorrectly!'))
    // password error
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return done(null, false, req.flash('error_messages', 'Account or password entered incorrectly!'))
    // Login successful
    return done(null, user)
  } catch (error) {
    console.log(error)
  }
}))

// passport serializeUser & deserializeUser
passport.serializeUser((user, cb) => cb(null, user.id))

passport.deserializeUser(async (id, cb) => {
  try {
    let user = await User.findById(id)
    user = user.toJSON()
    console.log(user)
    return cb(null, user)
  } catch (error) {
    cb(error)
  }
})

module.exports = passport
