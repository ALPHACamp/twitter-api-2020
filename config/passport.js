const passport = require('passport')
const passportJWT = require('passport-jwt')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User } = require('../models')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.use(
  new LocalStrategy(
    {
      // 因為只有usernameField變成account，所以只改這個
      usernameField: 'account'
    },
    (account, password, cb) => {
      User.findOne({ where: { account } })
        .then(user => {
          // 如果使用者不存在
          if (!user) return cb(null, false, { message: 'The username and password your provided are invalid' })
          // 如果使用者密碼錯誤
          return bcrypt.compare(password, user.password).then(res => {
            if (!res) { return cb(null, false, { message: 'The username and password your provided are invalid' }) }
            // 認證成功，回傳user資訊
            return cb(null, user, { message: 'Login Successfully!' })
          })
        })
        .catch(error => cb(error))
    }
  )
)

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}
passport.use(
  new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
    User.findByPk(jwtPayload.id)
      .then(user => cb(null, user))
      .catch(err => cb(err))
  })
)

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  return User.findByPk(id)
    .then(user => cb(null, user.toJSON()))
    .catch(err => cb(err))
})

module.exports = passport
