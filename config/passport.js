const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')

const { User } = require('../models')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
// set up Passport strategy
passport.use(
  new LocalStrategy(
    // customize user field
    // username should be 'account' from Ray
    {
      usernameField: 'account',
      passwordField: 'password',
      passReqToCallback: true
    },
    // authenticate user
    // req.flash，因為沒有view，所以flash接到也看不到，我調整成直接回傳一包資料 from Ray
    (req, account, password, cb) => {
      User.findOne({ where: { account } }).then(user => {
        if (!user) {
          return cb(
            null,
            false,
            { status: 401, message: '帳號不存在！' }
          )
        }
        bcrypt.compare(password, user.password).then(res => {
          if (!res) {
            return cb(
              null,
              false,
              { status: 401, message: '帳號或密碼輸入錯誤！' }
            )
          }
          return cb(null, user)
        })
      })
    }
  )
)
// 要記得設定JWT_SECRET from Ray
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}
// 後續或許可以加上 include Follower 的資料（可以參考餐廳論壇）from Ray
passport.use(
  new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
    User.findByPk(jwtPayload.id)
      .then(user => cb(null, user))
      .catch(err => cb(err))
  })
)

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  return User.findByPk(id)
    .then(user => cb(null, user.toJSON()))
    .catch(err => cb(err))
})
module.exports = passport
