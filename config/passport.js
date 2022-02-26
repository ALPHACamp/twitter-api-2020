const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')

const { User, Tweet, Reply, Like } = require('../models')
const bcrypt = require('bcryptjs')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

// 本地登入認證
passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password'
  },

  (account, password, cb) => {
    // 查詢是否資料有輸入的email資料
    User.findOne({ where: { account } })
      .then(user => {
        // 沒有使用者資料，回傳錯誤
        if (!user) throw new Error('帳號或密碼輸入錯誤!')

        // 比對密碼
        bcrypt.compare(password, user.password)
          .then(res => {
            // 不一致，回傳錯誤
            if (!res) throw new Error ('帳號或密碼輸入錯誤!')

            // 回傳user
            return cb(null, user)
          })
      })
      .catch(err => cb(err))
  }
))

// 宣告物件，token的 bearer 資訊，與所設定的金鑰
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}

// 設定jwt的登入策略
passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  // 使用payload的id資料尋找user資料，並關連其他model
  User.findByPk(jwtPayload.id, {
    include: [
      { model: Tweet },
      { model: Like, include: Tweet },
      { model: Reply, include: Tweet },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
    .then(user => {
      cb(null, user)
    }) // 回傳user資料
    .catch(err => cb(err))
}))


module.exports = passport