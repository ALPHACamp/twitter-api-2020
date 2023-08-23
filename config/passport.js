const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

const ExtractJWT = passportJWT.ExtractJwt
const JWTStrategy = passportJWT.Strategy

// local strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password'
  },
  async (account, password, done) => {
    try {
      const cause = { // 定義不同的錯誤訊息，以便前端顯示之用
        accountErrMsg: '',
        passwordErrMsg: ''
      }

      // 確認必填值是否為空
      if (!account) cause.accountErrMsg += '此為必填欄位。'
      if (!password) cause.passwordErrMsg += '此為必填欄位。'
      if (cause.accountErrMsg || cause.passwordErrMsg) {
        throw new Error('Empty input value!', { cause })
      }

      // 確認帳號是否存在
      const user = await User.findOne({ where: { account } })
      if (!user) {
        cause.accountErrMsg += '帳號不存在！'
        throw new Error('User does not exist!', { cause })
      }

      // 確認密碼是否正確
      const result = await bcrypt.compare(password, user.password)
      if (!result) {
        cause.passwordErrMsg += '不正確的密碼！'
        throw new Error('Incorrect password!', { cause })
      }

      return done(null, user)
    } catch (err) {
      return done(err)
    }
  }
))

// jwt strategy
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JWTStrategy(jwtOptions, async (jwtPayload, done) => {
  try {
    const user = await User.findByPk(jwtPayload.id)
    if (!user) return done(null, false)

    return done(null, user)
  } catch (error) {
    return done(error)
  }
})
)

module.exports = passport
