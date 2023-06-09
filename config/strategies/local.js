const LocalStrategy = require('passport-local')
const { User } = require('../../models')
const bcrypt = require('bcryptjs')

module.exports = passport => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (email, password, done) => {
    // check input
    if (!email?.trim() || !password?.trim()) {
      const error = new Error('請輸入完整資料')
      error.status = 401
      return done(error, false)
    }

    // use email to check user exist
    // 查出使用者資料，放入req.user
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) {
          const error = new Error('使用者不存在！')
          error.status = 401
          return done(error, false)
        }
        // compare password
        bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            const error = new Error('信箱或是密碼錯誤！')
            error.status = 401
            return done(error, false)
          }
          // authenticated, return user
          return done(null, user.get())
        })
          .catch(err => done(err, false))
      })
  }))
}
