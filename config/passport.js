const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User } = require('../models')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
// 本地策略
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, account, password, cb) => {
    // 檢查請求路徑是否是前台或後台登入
    const isUserLogin = req.path.includes('users')
    const isAdminLogin = req.path.includes('admin')
    User.findOne({ where: { account } })
      // 如果找不到帳號
      .then(user => {
        if (!user) {
          const err = new Error('帳號不存在！')
          err.status = 401
          throw err
        }
        if (isUserLogin && user.role !== 'user') {
          const err = new Error('不可用後台帳號登入前台！')
          err.status = 401
          throw err
        }
        if (isAdminLogin && user.role !== 'admin') {
          const err = new Error('不可用前台帳號登入後台！')
          err.status = 401
          throw err
        }
        bcrypt.compare(password, user.password).then(match => {
          // 如果密碼錯誤也提示帳號不存在
          if (!match) {
            const err = new Error('帳號不存在！')
            err.status = 401
            throw err
          }
          return cb(null, user)
        })
          .catch(err => cb(err))
      })
      .catch(err => cb(err))
  }
))
// JWT
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}
// JWT
passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id, {
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
  //  user通過認證之後，產生的user會是 Sequelize 模型，現為了避免衝突先不動，後續refactor再轉換為 JavaScript 簡單物件
  //  .then(user => cb(null, user.toJSON()))
    .then(user => cb(null, user)) // 這個user是 Sequelize 模型 (複雜物件)
    .catch(err => cb(err))
}))

// API版本不會走序列化與反序列化
// 序列化
// passport.serializeUser((user, cb) => {
//   cb(null, user.id)
// })
// // 反序列化
// passport.deserializeUser((id, cb) => {
//   return User.findByPk(id, {
//     include: [
//       { model: User, as: 'Followers' },
//       { model: User, as: 'Followings' }
//     ]
//   })
//     .then(user => cb(null, user.toJSON()))
//     .catch(err => cb(err))
// })
module.exports = passport